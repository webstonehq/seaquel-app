const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./CPsWJ2lo.js","./Cn4yfEqx.js","./C0WgSmEm.js","./CrsMhzse.js","./YcGbPvzl.js","./PPVm8Dsz.js","./CHl_8NPJ.js","./CUPhwB-t.js","./VmzOj_oK.js","./BNwbiuAh.js","./BeQ8IkaG.js","./CQuJ3efz.js","./BSVBbVFJ.js","./CE1G-McA.js"])))=>i.map(i=>d[i]);
import{_ as p}from"./PPVm8Dsz.js";import{i as $,a as k}from"./BNwbiuAh.js";const J=4,P=[`CREATE TABLE IF NOT EXISTS schema_version (
    version INTEGER NOT NULL,
    migrated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,`CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    git_repo_path TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,`CREATE TABLE IF NOT EXISTS project_labels (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    is_predefined INTEGER NOT NULL DEFAULT 0,
    color TEXT NOT NULL
  )`,`CREATE TABLE IF NOT EXISTS app_state (
    key TEXT PRIMARY KEY,
    value TEXT
  )`,`CREATE TABLE IF NOT EXISTS connections (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    host TEXT NOT NULL,
    port INTEGER NOT NULL,
    database_name TEXT NOT NULL,
    username TEXT NOT NULL,
    ssl_mode TEXT,
    connection_string TEXT,
    last_connected TEXT,
    ssh_tunnel TEXT,
    save_password INTEGER NOT NULL DEFAULT 0,
    save_ssh_password INTEGER NOT NULL DEFAULT 0,
    save_ssh_key_passphrase INTEGER NOT NULL DEFAULT 0,
    is_local_only INTEGER NOT NULL DEFAULT 0,
    shared_connection_id TEXT,
    ai_share_schema INTEGER,
    ai_share_data INTEGER,
    active_ai_provider_id TEXT,
    active_ai_model TEXT
  )`,"CREATE INDEX IF NOT EXISTS idx_connections_project ON connections(project_id)",`CREATE TABLE IF NOT EXISTS connection_labels (
    connection_id TEXT NOT NULL REFERENCES connections(id) ON DELETE CASCADE,
    label_id TEXT NOT NULL,
    PRIMARY KEY (connection_id, label_id)
  )`,`CREATE TABLE IF NOT EXISTS project_state (
    project_id TEXT PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
    active_view TEXT NOT NULL DEFAULT 'query',
    active_connection_id TEXT,
    active_query_tab_id TEXT,
    active_schema_tab_id TEXT,
    active_explain_tab_id TEXT,
    active_erd_tab_id TEXT,
    active_statistics_tab_id TEXT,
    active_workflow_tab_id TEXT,
    active_visualize_tab_id TEXT,
    active_starter_tab_id TEXT,
    active_dashboard_tab_id TEXT,
    active_create_table_tab_id TEXT,
    active_data_tab_id TEXT,
    tab_order TEXT NOT NULL DEFAULT '[]',
    connection_order TEXT NOT NULL DEFAULT '[]',
    starred_shared_query_ids TEXT NOT NULL DEFAULT '[]',
    starred_shared_dashboard_ids TEXT NOT NULL DEFAULT '[]',
    pane_layout TEXT
  )`,`CREATE TABLE IF NOT EXISTS tabs (
    id TEXT NOT NULL,
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    tab_type TEXT NOT NULL,
    name TEXT NOT NULL,
    query TEXT,
    saved_query_id TEXT,
    shared_query_id TEXT,
    table_name TEXT,
    schema_name TEXT,
    source_query TEXT,
    connection_id TEXT,
    starter_type TEXT,
    closable INTEGER,
    PRIMARY KEY (id, project_id)
  )`,"CREATE INDEX IF NOT EXISTS idx_tabs_project ON tabs(project_id)",`CREATE TABLE IF NOT EXISTS saved_queries (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    query TEXT NOT NULL,
    parameters TEXT,
    starred INTEGER NOT NULL DEFAULT 0,
    shared INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    database_type TEXT,
    tags TEXT,
    folder TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,"CREATE INDEX IF NOT EXISTS idx_saved_queries_project ON saved_queries(project_id)",`CREATE TABLE IF NOT EXISTS query_versions (
    id TEXT PRIMARY KEY,
    saved_query_id TEXT NOT NULL REFERENCES saved_queries(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    snapshot TEXT,
    diff TEXT,
    created_at TEXT NOT NULL,
    UNIQUE(saved_query_id, version),
    CHECK ((snapshot IS NOT NULL AND diff IS NULL) OR (snapshot IS NULL AND diff IS NOT NULL))
  )`,"CREATE INDEX IF NOT EXISTS idx_query_versions_saved_query ON query_versions(saved_query_id, version DESC)",`CREATE TABLE IF NOT EXISTS query_history (
    id TEXT PRIMARY KEY,
    connection_id TEXT NOT NULL REFERENCES connections(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    execution_time REAL NOT NULL,
    row_count INTEGER NOT NULL,
    favorite INTEGER NOT NULL DEFAULT 0,
    connection_labels_snapshot TEXT,
    connection_name_snapshot TEXT NOT NULL DEFAULT ''
  )`,"CREATE INDEX IF NOT EXISTS idx_history_conn_time ON query_history(connection_id, timestamp DESC)",`CREATE TABLE IF NOT EXISTS shared_repos (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL
  )`,`CREATE TABLE IF NOT EXISTS saved_canvases (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    data TEXT NOT NULL
  )`,`CREATE TABLE IF NOT EXISTS theme_preferences (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    light_theme_id TEXT NOT NULL DEFAULT 'default-light',
    dark_theme_id TEXT NOT NULL DEFAULT 'default-dark'
  )`,`CREATE TABLE IF NOT EXISTS user_themes (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL
  )`,`CREATE TABLE IF NOT EXISTS license_state (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    data TEXT NOT NULL DEFAULT '{}'
  )`,`CREATE TABLE IF NOT EXISTS onboarding_state (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    data TEXT NOT NULL DEFAULT '{}'
  )`,`CREATE TABLE IF NOT EXISTS tutorial_progress (
    lesson_id TEXT NOT NULL,
    challenge_id TEXT NOT NULL,
    state TEXT,
    PRIMARY KEY (lesson_id, challenge_id)
  )`,`CREATE TABLE IF NOT EXISTS import_state (
    source TEXT PRIMARY KEY,
    has_offered_import INTEGER NOT NULL DEFAULT 0,
    last_check_timestamp TEXT
  )`,`CREATE TABLE IF NOT EXISTS connection_overrides (
    shared_connection_id TEXT PRIMARY KEY,
    username TEXT,
    host_override TEXT,
    port_override INTEGER,
    save_password INTEGER NOT NULL DEFAULT 0,
    save_ssh_password INTEGER NOT NULL DEFAULT 0,
    save_ssh_key_passphrase INTEGER NOT NULL DEFAULT 0
  )`,`CREATE TABLE IF NOT EXISTS dashboards (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    viewport TEXT NOT NULL DEFAULT '{"x":0,"y":0,"zoom":1}',
    widgets TEXT NOT NULL DEFAULT '[]',
    date_filter TEXT,
    starred INTEGER DEFAULT 0,
    shared INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,"CREATE INDEX IF NOT EXISTS idx_dashboards_project ON dashboards(project_id)",`CREATE TABLE IF NOT EXISTS dashboard_versions (
    id TEXT PRIMARY KEY,
    dashboard_id TEXT NOT NULL REFERENCES dashboards(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    snapshot TEXT NOT NULL,
    created_at TEXT NOT NULL,
    UNIQUE(dashboard_id, version)
  )`,"CREATE INDEX IF NOT EXISTS idx_dashboard_versions_dashboard ON dashboard_versions(dashboard_id, version DESC)",`CREATE TABLE IF NOT EXISTS ai_chats (
    id TEXT PRIMARY KEY,
    connection_id TEXT NOT NULL REFERENCES connections(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,"CREATE INDEX IF NOT EXISTS idx_ai_chats_connection ON ai_chats(connection_id)",`CREATE TABLE IF NOT EXISTS vault_state (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    salt TEXT NOT NULL,
    kdf_params TEXT NOT NULL,
    verifier TEXT NOT NULL,
    verifier_nonce TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`,`CREATE TABLE IF NOT EXISTS user_credentials (
    scope TEXT NOT NULL,
    key TEXT NOT NULL,
    nonce TEXT NOT NULL,
    ciphertext TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    PRIMARY KEY (scope, key)
  )`,`CREATE TABLE IF NOT EXISTS ai_messages (
    id TEXT PRIMARY KEY,
    chat_id TEXT NOT NULL REFERENCES ai_chats(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    query TEXT,
    dashboard_id TEXT
  )`,"CREATE INDEX IF NOT EXISTS idx_ai_messages_chat ON ai_messages(chat_id)"];async function Q(e){if((await e.query("SELECT name FROM sqlite_master WHERE type='table' AND name='schema_version'")).length>0)return await z(e),!1;const t=P.map(s=>({sql:s}));return await e.transaction(t),!0}async function z(e){const a=[{table:"project_state",column:"active_dashboard_tab_id",sql:"ALTER TABLE project_state ADD COLUMN active_dashboard_tab_id TEXT"},{table:"projects",column:"git_repo_path",sql:"ALTER TABLE projects ADD COLUMN git_repo_path TEXT"},{table:"connections",column:"is_local_only",sql:"ALTER TABLE connections ADD COLUMN is_local_only INTEGER NOT NULL DEFAULT 0"},{table:"connections",column:"shared_connection_id",sql:"ALTER TABLE connections ADD COLUMN shared_connection_id TEXT"},{table:"saved_queries",column:"starred",sql:"ALTER TABLE saved_queries ADD COLUMN starred INTEGER NOT NULL DEFAULT 0"},{table:"project_state",column:"starred_shared_query_ids",sql:"ALTER TABLE project_state ADD COLUMN starred_shared_query_ids TEXT NOT NULL DEFAULT '[]'"},{table:"project_state",column:"starred_shared_dashboard_ids",sql:"ALTER TABLE project_state ADD COLUMN starred_shared_dashboard_ids TEXT NOT NULL DEFAULT '[]'"},{table:"dashboards",column:"starred",sql:"ALTER TABLE dashboards ADD COLUMN starred INTEGER DEFAULT 0"},{table:"connections",column:"ai_share_schema",sql:"ALTER TABLE connections ADD COLUMN ai_share_schema INTEGER"},{table:"connections",column:"ai_share_data",sql:"ALTER TABLE connections ADD COLUMN ai_share_data INTEGER"},{table:"connections",column:"active_ai_provider_id",sql:"ALTER TABLE connections ADD COLUMN active_ai_provider_id TEXT"},{table:"connections",column:"active_ai_model",sql:"ALTER TABLE connections ADD COLUMN active_ai_model TEXT"},{table:"project_state",column:"pane_layout",sql:"ALTER TABLE project_state ADD COLUMN pane_layout TEXT"},{table:"dashboards",column:"shared",sql:"ALTER TABLE dashboards ADD COLUMN shared INTEGER NOT NULL DEFAULT 0"},{table:"dashboards",column:"description",sql:"ALTER TABLE dashboards ADD COLUMN description TEXT"},{table:"saved_queries",column:"shared",sql:"ALTER TABLE saved_queries ADD COLUMN shared INTEGER NOT NULL DEFAULT 0"},{table:"saved_queries",column:"description",sql:"ALTER TABLE saved_queries ADD COLUMN description TEXT"},{table:"saved_queries",column:"database_type",sql:"ALTER TABLE saved_queries ADD COLUMN database_type TEXT"},{table:"saved_queries",column:"tags",sql:"ALTER TABLE saved_queries ADD COLUMN tags TEXT"},{table:"saved_queries",column:"folder",sql:"ALTER TABLE saved_queries ADD COLUMN folder TEXT"},{table:"project_state",column:"active_create_table_tab_id",sql:"ALTER TABLE project_state ADD COLUMN active_create_table_tab_id TEXT"},{table:"project_state",column:"active_data_tab_id",sql:"ALTER TABLE project_state ADD COLUMN active_data_tab_id TEXT"},{table:"ai_messages",column:"dashboard_id",sql:"ALTER TABLE ai_messages ADD COLUMN dashboard_id TEXT"},{table:"project_state",column:"connection_order",sql:"ALTER TABLE project_state ADD COLUMN connection_order TEXT NOT NULL DEFAULT '[]'"}],t=new Set(a.map(E=>E.table));t.add("saved_queries"),t.add("dashboards"),t.add("project_state");const s=new Map;for(const E of t){const L=await e.query(`PRAGMA table_info(${E})`);s.set(E,new Set(L.map(R=>R.name)))}for(const E of a)s.get(E.table).has(E.column)||await e.execute(E.sql);const i=s.get("saved_queries");i.has("connection_id")&&!i.has("project_id")&&(await e.execute("ALTER TABLE saved_queries ADD COLUMN project_id TEXT"),await e.execute(`UPDATE saved_queries SET project_id = (
        SELECT project_id FROM connections WHERE connections.id = saved_queries.connection_id
      ) WHERE project_id IS NULL`),await e.execute("DELETE FROM saved_queries WHERE project_id IS NULL")),i.has("connection_id")&&(await e.execute("DROP INDEX IF EXISTS idx_saved_queries_connection"),await e.execute("ALTER TABLE saved_queries DROP COLUMN connection_id"));const r=s.get("dashboards");r.has("connection_id")&&!r.has("project_id")&&(await e.execute("ALTER TABLE dashboards ADD COLUMN project_id TEXT"),await e.execute(`UPDATE dashboards SET project_id = (
        SELECT project_id FROM connections WHERE connections.id = dashboards.connection_id
      ) WHERE project_id IS NULL`),await e.execute("DELETE FROM dashboards WHERE project_id IS NULL")),r.has("connection_id")&&(await e.execute("DROP INDEX IF EXISTS idx_dashboards_connection"),await e.execute("ALTER TABLE dashboards DROP COLUMN connection_id"));const c=s.get("project_state");c.has("active_canvas_tab_id")&&!c.has("active_workflow_tab_id")&&await e.execute("ALTER TABLE project_state RENAME COLUMN active_canvas_tab_id TO active_workflow_tab_id"),await e.execute("UPDATE project_state SET active_view = 'workflow' WHERE active_view = 'canvas'"),await e.transaction(P.map(E=>({sql:E})))}const j={async get(e,a){const t=await e.query("SELECT value FROM app_state WHERE key = ?",[a]);return t.length===0?null:t[0].value},async set(e,a,t){await e.execute("INSERT OR REPLACE INTO app_state (key, value) VALUES (?, ?)",[a,t])}};let y=null,A=null;async function Z(){return y||A||(A=(async()=>{try{let e,a=!0;if($()){const{getDataDir:t}=await p(async()=>{const{getDataDir:c}=await import("./CPsWJ2lo.js").then(E=>E.w);return{getDataDir:c}},__vite__mapDeps([0,1,2]),import.meta.url),{TauriSqliteProvider:s}=await p(async()=>{const{TauriSqliteProvider:c}=await import("./CrsMhzse.js");return{TauriSqliteProvider:c}},__vite__mapDeps([3,1]),import.meta.url),i=new s,r=await t();e=await i.open(`${r}/seaquel.db`)}else if(k()){const{HttpSqliteProvider:t}=await p(async()=>{const{HttpSqliteProvider:i}=await import("./CNXqez4x.js");return{HttpSqliteProvider:i}},[],import.meta.url);e=await new t().open(""),a=!1}else{const{WebSqliteProvider:t}=await p(async()=>{const{WebSqliteProvider:i}=await import("./YcGbPvzl.js");return{WebSqliteProvider:i}},__vite__mapDeps([4,5,6]),import.meta.url);e=await new t().open("seaquel.db")}if(a){await e.execute("PRAGMA journal_mode=WAL"),await e.execute("PRAGMA foreign_keys=ON");const t=await Q(e),{JSON_MIGRATION_DONE_KEY:s}=await p(async()=>{const{JSON_MIGRATION_DONE_KEY:r}=await import("./CUPhwB-t.js");return{JSON_MIGRATION_DONE_KEY:r}},__vite__mapDeps([7,5,8,9,10,11]),import.meta.url),i=await j.get(e,s)==="true";if(t){const{migrateJsonToSqlite:r}=await p(async()=>{const{migrateJsonToSqlite:c}=await import("./CUPhwB-t.js");return{migrateJsonToSqlite:c}},__vite__mapDeps([7,5,8,9,10,11]),import.meta.url);await r(e),await e.execute("INSERT INTO schema_version (version) VALUES (?)",[J])}else if(!i&&(await e.query("SELECT COUNT(*) as count FROM connections"))[0].count===0){const{migrateJsonToSqlite:c}=await p(async()=>{const{migrateJsonToSqlite:E}=await import("./CUPhwB-t.js");return{migrateJsonToSqlite:E}},__vite__mapDeps([7,5,8,9,10,11]),import.meta.url);await c(e)}i||await j.set(e,s,"true")}return y=e,e}catch(e){throw A=null,e}})(),A)}const se=Object.freeze(Object.defineProperty({__proto__:null,getDatabase:Z},Symbol.toStringTag,{value:"Module"}));function g(e,a){if(!e)return a;try{return JSON.parse(e)}catch{return a}}function o(e){return{dbColumn:e,toDb:a=>a,fromDb:a=>a}}function d(e){return{dbColumn:e,toDb:a=>a??null,fromDb:a=>a??void 0}}function l(e){return{dbColumn:e,toDb:a=>a?1:0,fromDb:a=>a===1}}function B(e){return{dbColumn:e,toDb:a=>a==null?null:a?1:0,fromDb:a=>a==null?void 0:a===1}}function f(e,a){return{dbColumn:e,toDb:t=>t==null?null:JSON.stringify(t),fromDb:t=>typeof t=="string"?g(t,a):t??a}}function u(e){const{table:a,id:t,columns:s}=e,i=Object.keys(s),r=i.map(n=>s[n]),c=r.map(n=>n.dbColumn),E=s[t],L=c.join(", "),R=c.map(()=>"?").join(", "),N=r.filter(n=>n.dbColumn!==E.dbColumn).map(n=>`${n.dbColumn} = excluded.${n.dbColumn}`).join(`,
         `),O=`INSERT INTO ${a} (${L})
       VALUES (${R})
       ON CONFLICT(${E.dbColumn}) DO UPDATE SET
         ${N}`,Y=`INSERT INTO ${a} (${L})
       VALUES (${R})`;function m(n){const T={};for(let _=0;_<i.length;_++)T[i[_]]=r[_].fromDb(n[r[_].dbColumn]);return T}function F(n){return i.map((T,_)=>r[_].toDb(n[T]))}async function x(n){return(await n.query(`SELECT ${L} FROM ${a}`)).map(m)}async function H(n,T,_){return(await n.query(`SELECT ${L} FROM ${a} WHERE ${T}`,_)).map(m)}async function G(n,T,_){const b=await n.query(`SELECT ${L} FROM ${a} WHERE ${T}`,_);return b.length===0?null:m(b[0])}async function M(n,T){await n.execute(O,F(T))}async function W(n,T){for(const _ of T)await M(n,_)}async function K(n,T){await n.execute(`DELETE FROM ${a} WHERE ${E.dbColumn} = ?`,[T])}async function V(n,T,_){await n.execute(`DELETE FROM ${a} WHERE ${T}`,_)}return{table:a,upsertSql:O,insertSql:Y,mapRow:m,toParams:F,loadAll:x,loadBy:H,loadOneBy:G,save:M,saveAll:W,remove:K,removeBy:V}}const C=u({table:"projects",id:"id",columns:{id:o("id"),name:o("name"),description:d("description"),createdAt:o("created_at"),updatedAt:o("updated_at"),gitRepoPath:d("git_repo_path")}}),oe={async loadAll(e){const a=await C.loadAll(e),t=[];for(const s of a){const i=await e.query("SELECT id, name, is_predefined, color FROM project_labels WHERE project_id = ?",[s.id]);t.push({...s,customLabels:i.map(r=>({id:r.id,name:r.name,isPredefined:r.is_predefined===1,color:r.color}))})}return t},async save(e,a){const{customLabels:t,...s}=a;await C.save(e,s),await e.execute("DELETE FROM project_labels WHERE project_id = ?",[a.id]);for(const i of t)await e.execute(`INSERT INTO project_labels (id, project_id, name, is_predefined, color)
         VALUES (?, ?, ?, ?, ?)`,[i.id,a.id,i.name,i.isPredefined?1:0,i.color])},async saveAll(e,a){for(const t of a)await this.save(e,t)},async remove(e,a){await C.remove(e,a)}},w=u({table:"connections",id:"id",columns:{id:o("id"),projectId:o("project_id"),name:o("name"),type:o("type"),host:o("host"),port:o("port"),databaseName:o("database_name"),username:o("username"),sslMode:d("ssl_mode"),connectionString:d("connection_string"),lastConnected:{dbColumn:"last_connected",toDb:e=>e instanceof Date?e.toISOString():e??null,fromDb:e=>e?new Date(e):void 0},sshTunnel:{dbColumn:"ssh_tunnel",toDb:e=>e?JSON.stringify(e):null,fromDb:e=>g(e,void 0)},savePassword:l("save_password"),saveSshPassword:l("save_ssh_password"),saveSshKeyPassphrase:l("save_ssh_key_passphrase"),isLocalOnly:{dbColumn:"is_local_only",toDb:e=>e?1:0,fromDb:e=>e===1?!0:void 0},sharedConnectionId:d("shared_connection_id"),aiShareSchema:B("ai_share_schema"),aiShareData:B("ai_share_data"),activeAIProviderId:d("active_ai_provider_id"),activeAIModel:d("active_ai_model")}}),ie={async loadAll(e){const a=await w.loadAll(e),t=[];for(const s of a){const i=await e.query("SELECT label_id FROM connection_labels WHERE connection_id = ?",[s.id]);t.push({...s,labelIds:i.map(r=>r.label_id)})}return t},async save(e,a){const{labelIds:t,...s}=a;await w.save(e,s),await e.execute("DELETE FROM connection_labels WHERE connection_id = ?",[a.id]);for(const i of t)await e.execute("INSERT INTO connection_labels (connection_id, label_id) VALUES (?, ?)",[a.id,i])},async remove(e,a){await w.remove(e,a)}},v=u({table:"connection_overrides",id:"sharedConnectionId",columns:{sharedConnectionId:o("shared_connection_id"),username:d("username"),hostOverride:d("host_override"),portOverride:d("port_override"),savePassword:l("save_password"),saveSshPassword:l("save_ssh_password"),saveSshKeyPassphrase:l("save_ssh_key_passphrase")}}),re={load(e,a){return v.loadOneBy(e,"shared_connection_id = ?",[a])},loadAll(e){return v.loadAll(e)},save(e,a){return v.save(e,a)},remove(e,a){return v.remove(e,a)}},h=u({table:"saved_queries",id:"id",columns:{id:o("id"),projectId:o("project_id"),name:o("name"),query:o("query"),parameters:f("parameters",void 0),starred:l("starred"),shared:l("shared"),description:d("description"),databaseType:d("database_type"),tags:f("tags",void 0),folder:d("folder"),createdAt:o("created_at"),updatedAt:o("updated_at")}}),ne={async loadByProject(e,a){return h.loadBy(e,"project_id = ?",[a])},async saveAll(e,a,t){const s=t.map(r=>r.id),i=[];if(s.length>0){const r=s.map(()=>"?").join(",");i.push({sql:`DELETE FROM saved_queries WHERE project_id = ? AND id NOT IN (${r})`,params:[a,...s]})}else i.push({sql:"DELETE FROM saved_queries WHERE project_id = ?",params:[a]});for(const r of t)i.push({sql:h.upsertSql,params:h.toParams(r)});await e.transaction(i)},async removeByProject(e,a){return h.removeBy(e,"project_id = ?",[a])}},D=u({table:"query_versions",id:"id",columns:{id:o("id"),queryId:o("saved_query_id"),version:o("version"),snapshot:o("snapshot"),diff:o("diff"),createdAt:o("created_at")}}),Ee={async loadByQuery(e,a){return(await e.query("SELECT * FROM query_versions WHERE saved_query_id = ? ORDER BY version ASC",[a])).map(s=>D.mapRow(s))},async loadByProject(e,a){return(await e.query(`SELECT qv.* FROM query_versions qv
       JOIN saved_queries sq ON sq.id = qv.saved_query_id
       WHERE sq.project_id = ?
       ORDER BY qv.saved_query_id, qv.version ASC`,[a])).map(s=>D.mapRow(s))},async insert(e,a){await e.execute(D.insertSql,D.toParams(a))},async pruneOldVersions(e,a,t){const s=await this.loadByQuery(e,a);if(s.length<=t)return;const i=[...s].sort((N,O)=>O.version-N.version),r=i[t-1]?.version;if(r===void 0)return;const{resolveVersions:c}=await p(async()=>{const{resolveVersions:N}=await import("./BSVBbVFJ.js");return{resolveVersions:N}},__vite__mapDeps([12,13]),import.meta.url),E=c(s.map(N=>({...N,createdAt:new Date(N.createdAt)}))),L=i[t-1],R=E.find(N=>N.id===L.id);await e.execute(`DELETE FROM query_versions
       WHERE saved_query_id = ?
         AND version < ?`,[a,r]),L.snapshot===null&&R&&await e.execute("UPDATE query_versions SET snapshot = ?, diff = NULL WHERE id = ?",[R.query,L.id])}},X=u({table:"query_history",id:"id",columns:{id:o("id"),query:o("query"),timestamp:o("timestamp"),executionTime:o("execution_time"),rowCount:o("row_count"),connectionId:o("connection_id"),favorite:l("favorite"),connectionLabelsSnapshot:f("connection_labels_snapshot",[]),connectionNameSnapshot:o("connection_name_snapshot")}}),Te={async loadByConnection(e,a){return(await e.query("SELECT * FROM query_history WHERE connection_id = ? ORDER BY timestamp DESC",[a])).map(s=>X.mapRow(s))},async replaceAll(e,a,t){const s=[{sql:"DELETE FROM query_history WHERE connection_id = ?",params:[a]}];for(const i of t)s.push({sql:X.insertSql,params:X.toParams(i)});await e.transaction(s)},async removeByConnection(e,a){await X.removeBy(e,"connection_id = ?",[a])}};function ee(e){return{dbColumn:e,toDb:a=>a??null,fromDb:a=>a}}const I=u({table:"dashboards",id:"id",columns:{id:o("id"),projectId:o("project_id"),name:o("name"),viewport:o("viewport"),widgets:o("widgets"),dateFilter:ee("date_filter"),starred:l("starred"),shared:l("shared"),description:d("description"),createdAt:o("created_at"),updatedAt:o("updated_at")}}),de={loadByProject(e,a){return I.loadBy(e,"project_id = ?",[a])},save(e,a){return I.save(e,a)},remove(e,a){return I.remove(e,a)},removeByProject(e,a){return I.removeBy(e,"project_id = ?",[a])}},S=u({table:"dashboard_versions",id:"id",columns:{id:o("id"),dashboardId:o("dashboard_id"),version:o("version"),snapshot:o("snapshot"),createdAt:o("created_at")}}),ce={async loadByDashboard(e,a){return(await e.query("SELECT * FROM dashboard_versions WHERE dashboard_id = ? ORDER BY version ASC",[a])).map(s=>S.mapRow(s))},async loadByProject(e,a){return(await e.query(`SELECT dv.* FROM dashboard_versions dv
       JOIN dashboards d ON d.id = dv.dashboard_id
       WHERE d.project_id = ?
       ORDER BY dv.dashboard_id, dv.version ASC`,[a])).map(s=>S.mapRow(s))},async insert(e,a){await e.execute(S.insertSql,S.toParams(a))},async pruneOldVersions(e,a,t){await e.execute(`DELETE FROM dashboard_versions
       WHERE dashboard_id = ?
         AND version <= (
           SELECT version FROM dashboard_versions
           WHERE dashboard_id = ?
           ORDER BY version DESC
           LIMIT 1 OFFSET ?
         )`,[a,a,t])}},U=u({table:"ai_chats",id:"id",columns:{id:o("id"),connectionId:o("connection_id"),title:o("title"),createdAt:o("created_at"),updatedAt:o("updated_at")}}),q=u({table:"ai_messages",id:"id",columns:{id:o("id"),chatId:o("chat_id"),role:o("role"),content:o("content"),timestamp:o("timestamp"),query:d("query"),dashboardId:d("dashboard_id")}}),_e={async loadByConnection(e,a){return(await e.query("SELECT * FROM ai_chats WHERE connection_id = ? ORDER BY updated_at DESC",[a])).map(s=>U.mapRow(s))},saveChat(e,a){return U.save(e,a)},removeChat(e,a){return U.remove(e,a)},removeByConnection(e,a){return U.removeBy(e,"connection_id = ?",[a])},async loadMessages(e,a){return(await e.query("SELECT * FROM ai_messages WHERE chat_id = ? ORDER BY timestamp ASC",[a])).map(s=>q.mapRow(s))},async replaceAllMessages(e,a,t){const s=[{sql:"DELETE FROM ai_messages WHERE chat_id = ?",params:[a]}];for(const i of t)s.push({sql:q.insertSql,params:q.toParams(i)});await e.transaction(s)}};export{J as C,j as a,_e as b,re as c,ie as d,ce as e,de as f,Ee as g,g as h,Z as i,se as j,oe as p,Te as q,ne as s};
