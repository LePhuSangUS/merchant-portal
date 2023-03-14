interface IInformationItem {
    id: string,
    title:any,
    dataList: {
      id: string,
      icon: any,
      label: any,
      content:string|null|undefined,
    }[]
}
  

export {
    IInformationItem
}