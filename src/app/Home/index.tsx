import 'reflect-metadata'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  useColorScheme,
  View,
  ViewStyle,
} from 'react-native'
import { styleType } from '@/utils/styles'
import { useNavigation } from '@react-navigation/native'
// import SearchBar from 'react-native-search-bar'
import { Repository } from '@/api/github/Repository'
import { RepItem } from './RepItem'
import { ItemSeparator } from '@/components/List/Separator'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch } from 'react-redux'
import { makeStyles } from 'react-native-swag-styles'
import { useSearchRepository } from './hooks/useSearchRepository'
import { enqueueSnackbar } from '@/redux/modules/snackbar/slice'
import { MainName } from '@/routes/main.constraint'
import { MainParams } from '@/routes/main.params'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { COLOR } from '@/constants/COLOR'

type ParamsProps = NativeStackNavigationProp<MainParams, 'Home'>

type Props = {}
type ComponentProps = Props & {
  items: Repository[]
  onPress: (repository: Repository) => void
  searchText: string
  onSearchButtonPress?: (text: string) => void
  onChangeText?: (text: string) => void
  onEndReached: () => void
  isLoading: boolean
}

const Component: React.FC<ComponentProps> = ({
  items,
  onPress,
  searchText,
  onSearchButtonPress,
  onChangeText,
  onEndReached,
  isLoading,
}) => {
  // const searchBarRef = useRef<SearchBar | null>(null)
  const styles = useStyles()

  const renderItem = useCallback<ListRenderItem<Repository>>(
    ({ item }) => <RepItem repository={item} onPress={onPress} />,
    [onPress],
  )

  const keyExtractor = useCallback((item: Repository) => {
    return item.id.toString() + '-' + item.name
  }, [])

  const ListHeaderComponent = useMemo(() => {
    return null
  }, [])

  // const ListHeaderComponent = useMemo(() => {
  //   return (
  //     <SearchBar
  //       placeholder="Search"
  //       text={searchText}
  //       onSearchButtonPress={(text) => {
  //         searchBarRef.current?.unFocus()
  //         onSearchButtonPress?.(text)
  //       }}
  //       onChangeText={onChangeText}
  //       style={styles.searchBar}
  //       ref={searchBarRef}
  //     />
  //   )
  // }, [onChangeText, onSearchButtonPress, searchText, styles.searchBar])

  const ListFooterComponent = useMemo(() => {
    return (
      <SafeAreaView edges={['bottom']}>
        <View style={styles.footer}>{isLoading && <ActivityIndicator />}</View>
      </SafeAreaView>
    )
  }, [isLoading, styles])

  return (
    <FlatList
      style={styles.container}
      data={items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ItemSeparatorComponent={ItemSeparator}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      onEndReached={onEndReached}
    />
  )
}

const Container: React.FC<Props> = (props) => {
  const navigation = useNavigation<ParamsProps>()
  const dispatch = useDispatch()
  const [keyword, setKeyword] = useState<string>('')

  const { items, loadMore, isLoading, error } = useSearchRepository(keyword)

  const onPress = useCallback(
    (repository: Repository) => {
      navigation.navigate(MainName.Detail, { repository: repository })
    },
    [navigation],
  )

  const onSearchButtonPress = useCallback((text: string) => {
    setKeyword(text)
  }, [])

  const onEndReached = useCallback(() => {
    loadMore()
  }, [loadMore])

  useEffect(() => {
    if (error instanceof Error) {
      dispatch(enqueueSnackbar({ message: error.message, type: 'error' }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  return (
    <Component
      {...props}
      items={items}
      onPress={onPress}
      searchText={keyword}
      onSearchButtonPress={onSearchButtonPress}
      onEndReached={onEndReached}
      isLoading={isLoading}
    />
  )
}

export { Container as Home }

const useStyles = makeStyles(useColorScheme, (colorScheme) => ({
  container: styleType<ViewStyle>({
    flex: 1,
    backgroundColor: COLOR(colorScheme).BACKGROUND.SECONDARY,
  }),
  searchBar: styleType<ViewStyle>({
    width: '100%',
    height: 60,
  }),
  footer: styleType<ViewStyle>({
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  }),
}))
