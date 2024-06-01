import { neon } from '@neondatabase/serverless';

const sql = neon("postgresql://test_owner:Eb2vWVLSZT9w@ep-holy-grass-a1my03fv.ap-southeast-1.aws.neon.tech/test?sslmode=require");

export default sql;