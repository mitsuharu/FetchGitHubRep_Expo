import React, { useCallback } from 'react'
import {
  Platform,
  Share,
  ShareContent,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native'
import { styleType } from '@/utils/styles'
import { useDispatch } from 'react-redux'
import { Button } from './index'
import { makeStyles } from 'react-native-swag-styles'
import { enqueueSnackbar } from '@/redux/modules/snackbar/slice'

type Props = {
  title: string
  url: string
}
type ComponentProps = Props & {
  onPress: () => void
}

const Component: React.FC<ComponentProps> = ({ onPress }) => {
  const styles = useStyles()
  return (
    <Button style={styles.container} onPress={onPress}>
      <Text style={styles.text}>share</Text>
    </Button>
  )
}

const Container: React.FC<Props> = (props) => {
  const { title, url } = props
  const dispatch = useDispatch()

  const onPress = useCallback(async () => {
    const content: ShareContent =
      Platform.OS === 'ios'
        ? { title: title, url: url }
        : { message: `${title} ${url}` }
    try {
      await Share.share(content, {
        excludedActivityTypes: [
          'com.apple.UIKit.activity.SaveToCameraRoll',
          'com.apple.UIKit.activity.AssignToContact',
          'com.apple.UIKit.activity.MarkupAsPDF',
          'com.apple.UIKit.activity.PostToVimeo',
          'com.apple.UIKit.activity.PostToWeibo',
          'com.apple.UIKit.activity.PostToTencentWeibo',
          'com.apple.UIKit.activity.PostToFlickr',
        ],
      })
    } catch (error: any) {
      console.warn(`ShareButton#doShare error: ${error}`)
      dispatch(
        enqueueSnackbar({ message: 'シェアに失敗しました', type: 'error' }),
      )
    }
  }, [title, url, dispatch])

  return <Component {...props} onPress={onPress} />
}

export { Container as ShareButton }

const useStyles = makeStyles(() => ({
  container: styleType<ViewStyle>({
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
  }),
  text: styleType<TextStyle>({
    borderColor: 'black',
    borderRadius: 8,
    borderWidth: 1,
    padding: 2,
    color: 'black',
  }),
}))
