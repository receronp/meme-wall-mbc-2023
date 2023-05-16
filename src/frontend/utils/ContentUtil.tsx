import { Content } from "src/declarations/wall/wall.did"

const getContent = (content: Content) => {
  if (content) {
    if ("Text" in content) {
      return content.Text
    } else if ("Image" in content) {
      return content.Image
    } else {
      return content.Survey
    }
  }
}

export { getContent }
