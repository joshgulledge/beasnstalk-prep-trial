import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import s3assets = require('@aws-cdk/aws-s3-assets');
import elasticbeanstalk = require('@aws-cdk/aws-elasticbeanstalk');

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkEbInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const webAppZipArchive = new s3assets.Asset(this, 'WebAppZip', {
      path: `${__dirname}/../app.zip`,
    });

    // Create a ElasticBeanStalk app.
    const appName = 'MyWebApp';
    const app = new elasticbeanstalk.CfnApplication(this, 'Application', {
      applicationName: appName,
    });

    // Create an app version from the S3 asset defined earlier
    const appVersionProps = new elasticbeanstalk.CfnApplicationVersion(this, 'AppVersion', {
      applicationName: appName,
      sourceBundle: {
        s3Bucket: webAppZipArchive.s3BucketName,
        s3Key: webAppZipArchive.s3ObjectKey,
      },
    });

    // Make sure that Elastic Beanstalk app exists before creating an app version
    appVersionProps.addDependsOn(app);

    // example resource
    // const queue = new sqs.Queue(this, 'CdkEbInfraQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
