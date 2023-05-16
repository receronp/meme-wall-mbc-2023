import { Content } from "src/declarations/wall/wall.did"

const getContentString = (content: Content) => {
  if (content) {
    if ("Text" in content) {
      return content.Text
    } else if ("Image" in content) {
      const imageContent = new Uint8Array(content.Image)
      return URL.createObjectURL(
        new Blob([imageContent.buffer], { type: "img/png" }),
      )
    } else {
      return content.Survey.title
    }
  } else {
    return "Message contains invalid content"
  }
}

export { getContentString }
