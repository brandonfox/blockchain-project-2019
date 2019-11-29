import * as line from "@line/bot-sdk";
const templateCarousel: line.TemplateCarousel = {
  type: "carousel",
  columns: []
};
export const locationTemplate: line.TemplateMessage = {
  type: "template",
  altText: "this is a carousel template",
  template: templateCarousel
};
