import { ApplicationInsights } from '@microsoft/applicationinsights-web'

const appInsights = new ApplicationInsights({ config: {
  connectionString: 'InstrumentationKey=c6386654-fd2c-44a7-b946-3d93145b249a;IngestionEndpoint=https://francecentral-1.in.applicationinsights.azure.com/;LiveEndpoint=https://francecentral.livediagnostics.monitor.azure.com/;ApplicationId=32f6d9a2-e3b7-4d86-aefd-96a0ab2b468d',
  /* ...Other Configuration Options... */
} });

appInsights.loadAppInsights();
appInsights.trackPageView();

export default appInsights;