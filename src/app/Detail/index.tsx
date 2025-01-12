import React, { useLayoutEffect, useMemo, useState } from 'react'
import { useColorScheme, View, ViewStyle } from 'react-native'
import { WebView } from 'react-native-webview'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { MainParams } from '@/routes/main.params'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ShareButton } from '@/components/Button/ShareButton'
import { makeStyles } from 'react-native-swag-styles'
import { styleType } from '@/utils/styles'

type ParamsProps = RouteProp<MainParams, 'Detail'>

type Props = {}
type ComponentProps = Props & {
  url: string
  isLoading: boolean
  setIsLoading: (value: boolean) => void
}

const Component: React.FC<ComponentProps> = ({
  url,
  isLoading,
  setIsLoading,
}) => {
  const styles = useStyles()

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: url }}
        style={styles.webView}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
      />
      <LoadingSpinner isLoading={isLoading} />
    </View>
  )
}

const Container: React.FC<Props> = (props) => {
  const navigation = useNavigation()
  const route = useRoute<ParamsProps>()
  const { repository } = route.params

  const url = useMemo(() => repository.url, [repository])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useLayoutEffect(() => {
    navigation.setOptions({
      title: repository.name,
      headerRight: () => {
        return <ShareButton title={repository.name} url={repository.url} />
      },
    })
  }, [navigation, repository])

  return <Component {...props} {...{ url, isLoading, setIsLoading }} />
}

export { Container as Detail }

const useStyles = makeStyles(useColorScheme, (_colorScheme) => ({
  container: styleType<ViewStyle>({
    flex: 1,
  }),
  webView: styleType<ViewStyle>({
    flex: 1,
  }),
}))
