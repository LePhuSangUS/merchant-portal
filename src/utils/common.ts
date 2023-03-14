import { notification as noti } from "antd";
import type { ArgsProps } from "antd/lib/notification";

export { message } from "antd";

interface configProps extends Partial<ArgsProps> {
  title?: string;
  content?: string;
  duration?: number;
}

class Notification {
  private getContent = (config: any = '') => (
    `${
      Object.keys(config).includes('content')
        ? config.content
        : typeof config === 'string'
          ? config
          : ''
    }`
  )
  private getTitle = (config: any = '') => (
    `${
      Object.keys(config).includes('title')
        ? config.title
        : ''
    }`
  )
  private getDuration  = (config: any = '', duration?: number) => (
    Object.keys(config).includes('duration')
      ? (config.duration || 0)
      : (duration || 0)
  )

  error = (config: configProps | string, duration?: number) => {
    return noti.error({
      message: this.getTitle(config),
      description: this.getContent(config),
      duration: this.getDuration(config, duration)
    })
  }
  success = (config: configProps | string, duration?: number) => {
    return noti.success({
      ...(typeof config === 'object' ? config : {}),
      message: this.getTitle(config),
      description: this.getContent(config),
      duration: this.getDuration(config, duration),
    })
  }
  destroy = noti.destroy
}

export const notification = new Notification()
