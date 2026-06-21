const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://evegah:Evegah@2026@72.60.101.157:5432/evegah_bms' });
client.connect().then(() => {
  return client.query("SELECT schemaname, tablename FROM pg_tables WHERE schemaname NOT IN ('pg_catalog', 'information_schema')");
}).then(res => {
  console.log(res.rows);
  client.end();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
