import React, { useLayoutEffect, useMemo, useState } from 'react'
import { useColorScheme, View, ViewStyle } from 'react-native'
import { WebView } from 'react-native-webview'
import { useNavigation } from '@react-navigation/native'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ShareButton } from '@/components/Button/ShareButton'
import { makeStyles } from 'react-native-swag-styles'
import { styleType } from '@/utils/styles'
import { useSearchParams } from 'expo-router/build/hooks'
import { Repository } from '@/api/github/Repository'

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
  const searchParams = useSearchParams()
  const repositoryJson = searchParams.get('repositoryJson')!
  const repository = JSON.parse(repositoryJson) as Repository

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

// export { Container as Detail }
export default Container

const useStyles = makeStyles(useColorScheme, (_colorScheme) => ({
  container: styleType<ViewStyle>({
    flex: 1,
  }),
  webView: styleType<ViewStyle>({
    flex: 1,
  }),
}))
