// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    /** allow dynamic indexing like process.env[name] */
    [key: string]: string | undefined;

    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?: string;

    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string;
    NEXTAUTH_URL?: string;
    NEXTAUTH_SECRET?: string;

    EMAIL_HOST?: string;
    EMAIL_PORT?: string;
    EMAIL_SECURE?: string;
    EMAIL_USER?: string;
    EMAIL_PASSWORD?: string;
    EMAIL_FROM_NAME?: string;
    EMAIL_FROM_ADDRESS?: string;
    CONTACT_EMAIL?: string;

    NEXT_PUBLIC_API_BASE_URL?: string;
    RAZORPAY_KEY_ID?: string;
    RAZORPAY_KEY_SECRET?: string;
  }
}
