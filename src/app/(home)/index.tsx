import 'reflect-metadata'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  useColorScheme,
  View,
  ViewStyle,
  TextInput,
} from 'react-native'
import { styleType } from '@/utils/styles'
import { Repository } from '@/api/github/Repository'
import { RepItem } from './_components/RepItem'
import { ItemSeparator } from '@/components/List/Separator'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch } from 'react-redux'
import { makeStyles } from 'react-native-swag-styles'
import { useSearchRepository } from './_hooks/useSearchRepository'
import { enqueueSnackbar } from '@/redux/modules/snackbar/slice'
import { COLOR } from '@/constants/COLOR'
import { SearchBar } from '@rneui/themed'
import { useRouter } from 'expo-router'

type Props = {}
type ComponentProps = Props & {
  items: Repository[]
  onPress: (repository: Repository) => void
  onSearchButtonPress?: (text: string) => void
  onEndReached: () => void
  isLoading: boolean
}

const Component: React.FC<ComponentProps> = ({
  items,
  onPress,
  onSearchButtonPress,
  onEndReached,
  isLoading,
}) => {
  const [searchBarText, setSearchBarText] = useState<string>('')
  const searchBarRef = useRef<TextInput | null>(null)
  const styles = useStyles()

  const renderItem = useCallback<ListRenderItem<Repository>>(
    ({ item }) => <RepItem repository={item} onPress={onPress} />,
    [onPress],
  )

  const keyExtractor = useCallback((item: Repository) => {
    return item.id.toString() + '-' + item.name
  }, [])

  const ListHeaderComponent = useMemo(() => {
    return (
      <SearchBar
        placeholder="Search"
        value={searchBarText}
        onChangeText={setSearchBarText}
        onBlur={(event) => {
          onSearchButtonPress?.(event.nativeEvent.text)
        }}
        containerStyle={styles.searchBar}
        lightTheme={true}
        round={true}
        showCancel={true}
        ref={searchBarRef}
      />
    )
  }, [onSearchButtonPress, searchBarText, styles.searchBar])

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
  const router = useRouter()
  const dispatch = useDispatch()
  const [keyword, setKeyword] = useState<string>('')
  const { items, loadMore, isLoading, error } = useSearchRepository(keyword)

  const onPress = useCallback(
    (repository: Repository) => {
      const json = JSON.stringify(repository)
      router.push({
        pathname: `/detail`,
        params: {
          repositoryJson: json,
        },
      })
    },
    [router],
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
      onSearchButtonPress={onSearchButtonPress}
      onEndReached={onEndReached}
      isLoading={isLoading}
    />
  )
}

// export { Container as Home }
export default Container

const useStyles = makeStyles(useColorScheme, (colorScheme) => ({
  container: styleType<ViewStyle>({
    flex: 1,
    backgroundColor: COLOR(colorScheme).BACKGROUND.SECONDARY,
  }),
  searchBar: styleType<ViewStyle>({
    width: '100%',
  }),
  footer: styleType<ViewStyle>({
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  }),
}))
