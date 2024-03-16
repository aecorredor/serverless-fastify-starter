const jobRunner = (env: 'dev' | 'prod', job: () => void) => {
  if (env === 'dev') {
    process.env.AWS_REGION = 'us-east-1';
    process.env.AWS_ACCESS_KEY_ID = process.env.DEV_AWS_ACCESS_KEY_ID;
    process.env.AWS_SECRET_ACCESS_KEY = process.env.DEV_AWS_SECRET_ACCESS_KEY;
  } else {
    process.env.AWS_REGION = 'us-east-2';
    process.env.AWS_ACCESS_KEY_ID = process.env.PROD_AWS_ACCESS_KEY_ID;
    process.env.AWS_SECRET_ACCESS_KEY = process.env.PROD_AWS_SECRET_ACCESS_KEY;
  }

  job();
};

export const dev = (job: () => void) => {
  return jobRunner('dev', job);
};

export const prod = (job: () => void) => {
  return jobRunner('prod', job);
};
