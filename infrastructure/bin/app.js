#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const cdk = __importStar(require("aws-cdk-lib"));
const treff_infrastructure_stack_1 = require("../lib/treff-infrastructure-stack");
const app = new cdk.App();
// Configuration
const config = {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION || 'us-east-2',
    },
    instanceType: 't4g.small', // ARM-based, cheaper
    mysqlRootPassword: process.env.MYSQL_ROOT_PASSWORD || 'ChangeMe123!',
    mysqlDatabase: 'treff_v2',
    mysqlUser: 'treff_user',
    mysqlPassword: process.env.MYSQL_PASSWORD || 'TreffPass123!',
    domainName: process.env.DOMAIN_NAME, // Optional: your domain name
    frontendBucketName: process.env.FRONTEND_BUCKET_NAME, // Optional: use existing bucket
    assetsBucketName: process.env.ASSETS_BUCKET_NAME, // Optional: use existing bucket
    twilioAccountSid: process.env.TWILIO_ACCOUNT_SID, // Optional: Twilio SMS
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN, // Optional: Twilio SMS
    twilioPhone: process.env.TWILIO_PHONE, // Optional: Twilio SMS
};
new treff_infrastructure_stack_1.TreffInfrastructureStack(app, 'TreffInfrastructureStack', {
    ...config,
    description: 'Treff POC Infrastructure - Budget EC2 + S3/CloudFront',
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLHVDQUFxQztBQUNyQyxpREFBbUM7QUFDbkMsa0ZBQTZFO0FBRTdFLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLGdCQUFnQjtBQUNoQixNQUFNLE1BQU0sR0FBRztJQUNiLEdBQUcsRUFBRTtRQUNILE9BQU8sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQjtRQUN4QyxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsSUFBSSxXQUFXO0tBQ3REO0lBQ0QsWUFBWSxFQUFFLFdBQVcsRUFBRSxxQkFBcUI7SUFDaEQsaUJBQWlCLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsSUFBSSxjQUFjO0lBQ3BFLGFBQWEsRUFBRSxVQUFVO0lBQ3pCLFNBQVMsRUFBRSxZQUFZO0lBQ3ZCLGFBQWEsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsSUFBSSxlQUFlO0lBQzVELFVBQVUsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSw2QkFBNkI7SUFDbEUsa0JBQWtCLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxnQ0FBZ0M7SUFDdEYsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxnQ0FBZ0M7SUFDbEYsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSx1QkFBdUI7SUFDekUsZUFBZSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsdUJBQXVCO0lBQ3ZFLFdBQVcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSx1QkFBdUI7Q0FDL0QsQ0FBQztBQUVGLElBQUkscURBQXdCLENBQUMsR0FBRyxFQUFFLDBCQUEwQixFQUFFO0lBQzVELEdBQUcsTUFBTTtJQUNULFdBQVcsRUFBRSx1REFBdUQ7Q0FDckUsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuaW1wb3J0ICdzb3VyY2UtbWFwLXN1cHBvcnQvcmVnaXN0ZXInO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IFRyZWZmSW5mcmFzdHJ1Y3R1cmVTdGFjayB9IGZyb20gJy4uL2xpYi90cmVmZi1pbmZyYXN0cnVjdHVyZS1zdGFjayc7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbi8vIENvbmZpZ3VyYXRpb25cbmNvbnN0IGNvbmZpZyA9IHtcbiAgZW52OiB7XG4gICAgYWNjb3VudDogcHJvY2Vzcy5lbnYuQ0RLX0RFRkFVTFRfQUNDT1VOVCxcbiAgICByZWdpb246IHByb2Nlc3MuZW52LkNES19ERUZBVUxUX1JFR0lPTiB8fCAndXMtZWFzdC0yJyxcbiAgfSxcbiAgaW5zdGFuY2VUeXBlOiAndDRnLnNtYWxsJywgLy8gQVJNLWJhc2VkLCBjaGVhcGVyXG4gIG15c3FsUm9vdFBhc3N3b3JkOiBwcm9jZXNzLmVudi5NWVNRTF9ST09UX1BBU1NXT1JEIHx8ICdDaGFuZ2VNZTEyMyEnLFxuICBteXNxbERhdGFiYXNlOiAndHJlZmZfdjInLFxuICBteXNxbFVzZXI6ICd0cmVmZl91c2VyJyxcbiAgbXlzcWxQYXNzd29yZDogcHJvY2Vzcy5lbnYuTVlTUUxfUEFTU1dPUkQgfHwgJ1RyZWZmUGFzczEyMyEnLFxuICBkb21haW5OYW1lOiBwcm9jZXNzLmVudi5ET01BSU5fTkFNRSwgLy8gT3B0aW9uYWw6IHlvdXIgZG9tYWluIG5hbWVcbiAgZnJvbnRlbmRCdWNrZXROYW1lOiBwcm9jZXNzLmVudi5GUk9OVEVORF9CVUNLRVRfTkFNRSwgLy8gT3B0aW9uYWw6IHVzZSBleGlzdGluZyBidWNrZXRcbiAgYXNzZXRzQnVja2V0TmFtZTogcHJvY2Vzcy5lbnYuQVNTRVRTX0JVQ0tFVF9OQU1FLCAvLyBPcHRpb25hbDogdXNlIGV4aXN0aW5nIGJ1Y2tldFxuICB0d2lsaW9BY2NvdW50U2lkOiBwcm9jZXNzLmVudi5UV0lMSU9fQUNDT1VOVF9TSUQsIC8vIE9wdGlvbmFsOiBUd2lsaW8gU01TXG4gIHR3aWxpb0F1dGhUb2tlbjogcHJvY2Vzcy5lbnYuVFdJTElPX0FVVEhfVE9LRU4sIC8vIE9wdGlvbmFsOiBUd2lsaW8gU01TXG4gIHR3aWxpb1Bob25lOiBwcm9jZXNzLmVudi5UV0lMSU9fUEhPTkUsIC8vIE9wdGlvbmFsOiBUd2lsaW8gU01TXG59O1xuXG5uZXcgVHJlZmZJbmZyYXN0cnVjdHVyZVN0YWNrKGFwcCwgJ1RyZWZmSW5mcmFzdHJ1Y3R1cmVTdGFjaycsIHtcbiAgLi4uY29uZmlnLFxuICBkZXNjcmlwdGlvbjogJ1RyZWZmIFBPQyBJbmZyYXN0cnVjdHVyZSAtIEJ1ZGdldCBFQzIgKyBTMy9DbG91ZEZyb250Jyxcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==