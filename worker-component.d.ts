declare global {
  type CFWorkerFetchHandler = ExportedHandler<Env>['fetch'];
  type WorkerComponent = {
    client: (el: HTMLElement) => Promise<any>,
    render: (data: any) => string
  }
}

export {};