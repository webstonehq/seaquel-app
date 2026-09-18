const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./7kfZRBxk.js","./Cn4yfEqx.js","./BaYKaJMF.js","./Cfl9AbCe.js","./CNtewGkE.js","./PPVm8Dsz.js","./CHl_8NPJ.js","./D_Fxwj62.js","./zWbI5fMR.js","./BNwbiuAh.js","./C-poQJEt.js","./DdegkHlV.js","./BSVBbVFJ.js","./CE1G-McA.js"])))=>i.map(i=>d[i]);
import{_ as R}from"./PPVm8Dsz.js";import{i as $,a as V}from"./BNwbiuAh.js";const k=4,B=[`CREATE TABLE IF NOT EXISTS schema_version (
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
  )`,"CREATE INDEX IF NOT EXISTS idx_ai_messages_chat ON ai_messages(chat_id)"];async function J(e){if((await e.query("SELECT name FROM sqlite_master WHERE type='table' AND name='schema_version'")).length>0)return await Q(e),!1;const s=B.map(t=>({sql:t}));return await e.transaction(s),!0}async function Q(e){const a=[{table:"project_state",column:"active_dashboard_tab_id",sql:"ALTER TABLE project_state ADD COLUMN active_dashboard_tab_id TEXT"},{table:"projects",column:"git_repo_path",sql:"ALTER TABLE projects ADD COLUMN git_repo_path TEXT"},{table:"connections",column:"is_local_only",sql:"ALTER TABLE connections ADD COLUMN is_local_only INTEGER NOT NULL DEFAULT 0"},{table:"connections",column:"shared_connection_id",sql:"ALTER TABLE connections ADD COLUMN shared_connection_id TEXT"},{table:"saved_queries",column:"starred",sql:"ALTER TABLE saved_queries ADD COLUMN starred INTEGER NOT NULL DEFAULT 0"},{table:"project_state",column:"starred_shared_query_ids",sql:"ALTER TABLE project_state ADD COLUMN starred_shared_query_ids TEXT NOT NULL DEFAULT '[]'"},{table:"project_state",column:"starred_shared_dashboard_ids",sql:"ALTER TABLE project_state ADD COLUMN starred_shared_dashboard_ids TEXT NOT NULL DEFAULT '[]'"},{table:"dashboards",column:"starred",sql:"ALTER TABLE dashboards ADD COLUMN starred INTEGER DEFAULT 0"},{table:"connections",column:"ai_share_schema",sql:"ALTER TABLE connections ADD COLUMN ai_share_schema INTEGER"},{table:"connections",column:"ai_share_data",sql:"ALTER TABLE connections ADD COLUMN ai_share_data INTEGER"},{table:"connections",column:"active_ai_provider_id",sql:"ALTER TABLE connections ADD COLUMN active_ai_provider_id TEXT"},{table:"connections",column:"active_ai_model",sql:"ALTER TABLE connections ADD COLUMN active_ai_model TEXT"},{table:"project_state",column:"pane_layout",sql:"ALTER TABLE project_state ADD COLUMN pane_layout TEXT"},{table:"dashboards",column:"shared",sql:"ALTER TABLE dashboards ADD COLUMN shared INTEGER NOT NULL DEFAULT 0"},{table:"dashboards",column:"description",sql:"ALTER TABLE dashboards ADD COLUMN description TEXT"},{table:"saved_queries",column:"shared",sql:"ALTER TABLE saved_queries ADD COLUMN shared INTEGER NOT NULL DEFAULT 0"},{table:"saved_queries",column:"description",sql:"ALTER TABLE saved_queries ADD COLUMN description TEXT"},{table:"saved_queries",column:"database_type",sql:"ALTER TABLE saved_queries ADD COLUMN database_type TEXT"},{table:"saved_queries",column:"tags",sql:"ALTER TABLE saved_queries ADD COLUMN tags TEXT"},{table:"saved_queries",column:"folder",sql:"ALTER TABLE saved_queries ADD COLUMN folder TEXT"},{table:"project_state",column:"active_create_table_tab_id",sql:"ALTER TABLE project_state ADD COLUMN active_create_table_tab_id TEXT"},{table:"project_state",column:"active_data_tab_id",sql:"ALTER TABLE project_state ADD COLUMN active_data_tab_id TEXT"},{table:"ai_messages",column:"dashboard_id",sql:"ALTER TABLE ai_messages ADD COLUMN dashboard_id TEXT"},{table:"project_state",column:"connection_order",sql:"ALTER TABLE project_state ADD COLUMN connection_order TEXT NOT NULL DEFAULT '[]'"}],s=new Set(a.map(T=>T.table));s.add("saved_queries"),s.add("dashboards"),s.add("project_state");const t=new Map;for(const T of s){const L=await e.query(`PRAGMA table_info(${T})`);t.set(T,new Set(L.map(p=>p.name)))}for(const T of a)t.get(T.table).has(T.column)||await e.execute(T.sql);const i=t.get("saved_queries");i.has("connection_id")&&!i.has("project_id")&&(await e.execute("ALTER TABLE saved_queries ADD COLUMN project_id TEXT"),await e.execute(`UPDATE saved_queries SET project_id = (
        SELECT project_id FROM connections WHERE connections.id = saved_queries.connection_id
      ) WHERE project_id IS NULL`),await e.execute("DELETE FROM saved_queries WHERE project_id IS NULL")),i.has("connection_id")&&(await e.execute("DROP INDEX IF EXISTS idx_saved_queries_connection"),await e.execute("ALTER TABLE saved_queries DROP COLUMN connection_id"));const r=t.get("dashboards");r.has("connection_id")&&!r.has("project_id")&&(await e.execute("ALTER TABLE dashboards ADD COLUMN project_id TEXT"),await e.execute(`UPDATE dashboards SET project_id = (
        SELECT project_id FROM connections WHERE connections.id = dashboards.connection_id
      ) WHERE project_id IS NULL`),await e.execute("DELETE FROM dashboards WHERE project_id IS NULL")),r.has("connection_id")&&(await e.execute("DROP INDEX IF EXISTS idx_dashboards_connection"),await e.execute("ALTER TABLE dashboards DROP COLUMN connection_id"));const _=t.get("project_state");_.has("active_canvas_tab_id")&&!_.has("active_workflow_tab_id")&&await e.execute("ALTER TABLE project_state RENAME COLUMN active_canvas_tab_id TO active_workflow_tab_id"),await e.execute("UPDATE project_state SET active_view = 'workflow' WHERE active_view = 'canvas'"),await e.transaction(B.map(T=>({sql:T})))}let y=null,A=null;async function z(){return y||A||(A=(async()=>{try{let e,a=!0;if($()){const{getDataDir:s}=await R(async()=>{const{getDataDir:_}=await import("./7kfZRBxk.js");return{getDataDir:_}},__vite__mapDeps([0,1,2]),import.meta.url),{TauriSqliteProvider:t}=await R(async()=>{const{TauriSqliteProvider:_}=await import("./Cfl9AbCe.js");return{TauriSqliteProvider:_}},__vite__mapDeps([3,1]),import.meta.url),i=new t,r=await s();e=await i.open(`${r}/seaquel.db`)}else if(V()){const{HttpSqliteProvider:s}=await R(async()=>{const{HttpSqliteProvider:i}=await import("./YP6gmoOa.js");return{HttpSqliteProvider:i}},[],import.meta.url);e=await new s().open(""),a=!1}else{const{WebSqliteProvider:s}=await R(async()=>{const{WebSqliteProvider:i}=await import("./CNtewGkE.js");return{WebSqliteProvider:i}},__vite__mapDeps([4,5,6]),import.meta.url);e=await new s().open("seaquel.db")}if(a){if(await e.execute("PRAGMA journal_mode=WAL"),await e.execute("PRAGMA foreign_keys=ON"),await J(e)){const{migrateJsonToSqlite:t}=await R(async()=>{const{migrateJsonToSqlite:i}=await import("./D_Fxwj62.js");return{migrateJsonToSqlite:i}},__vite__mapDeps([7,5,8,9,10,11]),import.meta.url);await t(e),await e.execute("INSERT INTO schema_version (version) VALUES (?)",[k])}else if((await e.query("SELECT COUNT(*) as count FROM connections"))[0].count===0){const{migrateJsonToSqlite:i}=await R(async()=>{const{migrateJsonToSqlite:r}=await import("./D_Fxwj62.js");return{migrateJsonToSqlite:r}},__vite__mapDeps([7,5,8,9,10,11]),import.meta.url);await i(e)}}return y=e,e}catch(e){throw A=null,e}})(),A)}const te=Object.freeze(Object.defineProperty({__proto__:null,getDatabase:z},Symbol.toStringTag,{value:"Module"}));function P(e,a){if(!e)return a;try{return JSON.parse(e)}catch{return a}}function o(e){return{dbColumn:e,toDb:a=>a,fromDb:a=>a}}function d(e){return{dbColumn:e,toDb:a=>a??null,fromDb:a=>a??void 0}}function l(e){return{dbColumn:e,toDb:a=>a?1:0,fromDb:a=>a===1}}function j(e){return{dbColumn:e,toDb:a=>a==null?null:a?1:0,fromDb:a=>a==null?void 0:a===1}}function f(e,a){return{dbColumn:e,toDb:s=>s==null?null:JSON.stringify(s),fromDb:s=>typeof s=="string"?P(s,a):s??a}}function u(e){const{table:a,id:s,columns:t}=e,i=Object.keys(t),r=i.map(n=>t[n]),_=r.map(n=>n.dbColumn),T=t[s],L=_.join(", "),p=_.map(()=>"?").join(", "),N=r.filter(n=>n.dbColumn!==T.dbColumn).map(n=>`${n.dbColumn} = excluded.${n.dbColumn}`).join(`,
         `),O=`INSERT INTO ${a} (${L})
       VALUES (${p})
       ON CONFLICT(${T.dbColumn}) DO UPDATE SET
         ${N}`,g=`INSERT INTO ${a} (${L})
       VALUES (${p})`;function m(n){const E={};for(let c=0;c<i.length;c++)E[i[c]]=r[c].fromDb(n[r[c].dbColumn]);return E}function F(n){return i.map((E,c)=>r[c].toDb(n[E]))}async function Y(n){return(await n.query(`SELECT ${L} FROM ${a}`)).map(m)}async function x(n,E,c){return(await n.query(`SELECT ${L} FROM ${a} WHERE ${E}`,c)).map(m)}async function H(n,E,c){const U=await n.query(`SELECT ${L} FROM ${a} WHERE ${E}`,c);return U.length===0?null:m(U[0])}async function M(n,E){await n.execute(O,F(E))}async function G(n,E){for(const c of E)await M(n,c)}async function W(n,E){await n.execute(`DELETE FROM ${a} WHERE ${T.dbColumn} = ?`,[E])}async function K(n,E,c){await n.execute(`DELETE FROM ${a} WHERE ${E}`,c)}return{table:a,upsertSql:O,insertSql:g,mapRow:m,toParams:F,loadAll:Y,loadBy:x,loadOneBy:H,save:M,saveAll:G,remove:W,removeBy:K}}const C=u({table:"projects",id:"id",columns:{id:o("id"),name:o("name"),description:d("description"),createdAt:o("created_at"),updatedAt:o("updated_at"),gitRepoPath:d("git_repo_path")}}),se={async loadAll(e){const a=await C.loadAll(e),s=[];for(const t of a){const i=await e.query("SELECT id, name, is_predefined, color FROM project_labels WHERE project_id = ?",[t.id]);s.push({...t,customLabels:i.map(r=>({id:r.id,name:r.name,isPredefined:r.is_predefined===1,color:r.color}))})}return s},async save(e,a){const{customLabels:s,...t}=a;await C.save(e,t),await e.execute("DELETE FROM project_labels WHERE project_id = ?",[a.id]);for(const i of s)await e.execute(`INSERT INTO project_labels (id, project_id, name, is_predefined, color)
         VALUES (?, ?, ?, ?, ?)`,[i.id,a.id,i.name,i.isPredefined?1:0,i.color])},async saveAll(e,a){for(const s of a)await this.save(e,s)},async remove(e,a){await C.remove(e,a)}},w=u({table:"connections",id:"id",columns:{id:o("id"),projectId:o("project_id"),name:o("name"),type:o("type"),host:o("host"),port:o("port"),databaseName:o("database_name"),username:o("username"),sslMode:d("ssl_mode"),connectionString:d("connection_string"),lastConnected:{dbColumn:"last_connected",toDb:e=>e instanceof Date?e.toISOString():e??null,fromDb:e=>e?new Date(e):void 0},sshTunnel:{dbColumn:"ssh_tunnel",toDb:e=>e?JSON.stringify(e):null,fromDb:e=>P(e,void 0)},savePassword:l("save_password"),saveSshPassword:l("save_ssh_password"),saveSshKeyPassphrase:l("save_ssh_key_passphrase"),isLocalOnly:{dbColumn:"is_local_only",toDb:e=>e?1:0,fromDb:e=>e===1?!0:void 0},sharedConnectionId:d("shared_connection_id"),aiShareSchema:j("ai_share_schema"),aiShareData:j("ai_share_data"),activeAIProviderId:d("active_ai_provider_id"),activeAIModel:d("active_ai_model")}}),oe={async loadAll(e){const a=await w.loadAll(e),s=[];for(const t of a){const i=await e.query("SELECT label_id FROM connection_labels WHERE connection_id = ?",[t.id]);s.push({...t,labelIds:i.map(r=>r.label_id)})}return s},async save(e,a){const{labelIds:s,...t}=a;await w.save(e,t),await e.execute("DELETE FROM connection_labels WHERE connection_id = ?",[a.id]);for(const i of s)await e.execute("INSERT INTO connection_labels (connection_id, label_id) VALUES (?, ?)",[a.id,i])},async remove(e,a){await w.remove(e,a)}},v=u({table:"connection_overrides",id:"sharedConnectionId",columns:{sharedConnectionId:o("shared_connection_id"),username:d("username"),hostOverride:d("host_override"),portOverride:d("port_override"),savePassword:l("save_password"),saveSshPassword:l("save_ssh_password"),saveSshKeyPassphrase:l("save_ssh_key_passphrase")}}),ie={load(e,a){return v.loadOneBy(e,"shared_connection_id = ?",[a])},loadAll(e){return v.loadAll(e)},save(e,a){return v.save(e,a)},remove(e,a){return v.remove(e,a)}},h=u({table:"saved_queries",id:"id",columns:{id:o("id"),projectId:o("project_id"),name:o("name"),query:o("query"),parameters:f("parameters",void 0),starred:l("starred"),shared:l("shared"),description:d("description"),databaseType:d("database_type"),tags:f("tags",void 0),folder:d("folder"),createdAt:o("created_at"),updatedAt:o("updated_at")}}),re={async loadByProject(e,a){return h.loadBy(e,"project_id = ?",[a])},async saveAll(e,a,s){const t=s.map(r=>r.id),i=[];if(t.length>0){const r=t.map(()=>"?").join(",");i.push({sql:`DELETE FROM saved_queries WHERE project_id = ? AND id NOT IN (${r})`,params:[a,...t]})}else i.push({sql:"DELETE FROM saved_queries WHERE project_id = ?",params:[a]});for(const r of s)i.push({sql:h.upsertSql,params:h.toParams(r)});await e.transaction(i)},async removeByProject(e,a){return h.removeBy(e,"project_id = ?",[a])}},D=u({table:"query_versions",id:"id",columns:{id:o("id"),queryId:o("saved_query_id"),version:o("version"),snapshot:o("snapshot"),diff:o("diff"),createdAt:o("created_at")}}),ne={async loadByQuery(e,a){return(await e.query("SELECT * FROM query_versions WHERE saved_query_id = ? ORDER BY version ASC",[a])).map(t=>D.mapRow(t))},async loadByProject(e,a){return(await e.query(`SELECT qv.* FROM query_versions qv
       JOIN saved_queries sq ON sq.id = qv.saved_query_id
       WHERE sq.project_id = ?
       ORDER BY qv.saved_query_id, qv.version ASC`,[a])).map(t=>D.mapRow(t))},async insert(e,a){await e.execute(D.insertSql,D.toParams(a))},async pruneOldVersions(e,a,s){const t=await this.loadByQuery(e,a);if(t.length<=s)return;const i=[...t].sort((N,O)=>O.version-N.version),r=i[s-1]?.version;if(r===void 0)return;const{resolveVersions:_}=await R(async()=>{const{resolveVersions:N}=await import("./BSVBbVFJ.js");return{resolveVersions:N}},__vite__mapDeps([12,13]),import.meta.url),T=_(t.map(N=>({...N,createdAt:new Date(N.createdAt)}))),L=i[s-1],p=T.find(N=>N.id===L.id);await e.execute(`DELETE FROM query_versions
       WHERE saved_query_id = ?
         AND version < ?`,[a,r]),L.snapshot===null&&p&&await e.execute("UPDATE query_versions SET snapshot = ?, diff = NULL WHERE id = ?",[p.query,L.id])}},X=u({table:"query_history",id:"id",columns:{id:o("id"),query:o("query"),timestamp:o("timestamp"),executionTime:o("execution_time"),rowCount:o("row_count"),connectionId:o("connection_id"),favorite:l("favorite"),connectionLabelsSnapshot:f("connection_labels_snapshot",[]),connectionNameSnapshot:o("connection_name_snapshot")}}),Ee={async loadByConnection(e,a){return(await e.query("SELECT * FROM query_history WHERE connection_id = ? ORDER BY timestamp DESC",[a])).map(t=>X.mapRow(t))},async replaceAll(e,a,s){const t=[{sql:"DELETE FROM query_history WHERE connection_id = ?",params:[a]}];for(const i of s)t.push({sql:X.insertSql,params:X.toParams(i)});await e.transaction(t)},async removeByConnection(e,a){await X.removeBy(e,"connection_id = ?",[a])}};function Z(e){return{dbColumn:e,toDb:a=>a??null,fromDb:a=>a}}const S=u({table:"dashboards",id:"id",columns:{id:o("id"),projectId:o("project_id"),name:o("name"),viewport:o("viewport"),widgets:o("widgets"),dateFilter:Z("date_filter"),starred:l("starred"),shared:l("shared"),description:d("description"),createdAt:o("created_at"),updatedAt:o("updated_at")}}),Te={loadByProject(e,a){return S.loadBy(e,"project_id = ?",[a])},save(e,a){return S.save(e,a)},remove(e,a){return S.remove(e,a)},removeByProject(e,a){return S.removeBy(e,"project_id = ?",[a])}},I=u({table:"dashboard_versions",id:"id",columns:{id:o("id"),dashboardId:o("dashboard_id"),version:o("version"),snapshot:o("snapshot"),createdAt:o("created_at")}}),de={async loadByDashboard(e,a){return(await e.query("SELECT * FROM dashboard_versions WHERE dashboard_id = ? ORDER BY version ASC",[a])).map(t=>I.mapRow(t))},async loadByProject(e,a){return(await e.query(`SELECT dv.* FROM dashboard_versions dv
       JOIN dashboards d ON d.id = dv.dashboard_id
       WHERE d.project_id = ?
       ORDER BY dv.dashboard_id, dv.version ASC`,[a])).map(t=>I.mapRow(t))},async insert(e,a){await e.execute(I.insertSql,I.toParams(a))},async pruneOldVersions(e,a,s){await e.execute(`DELETE FROM dashboard_versions
       WHERE dashboard_id = ?
         AND version <= (
           SELECT version FROM dashboard_versions
           WHERE dashboard_id = ?
           ORDER BY version DESC
           LIMIT 1 OFFSET ?
         )`,[a,a,s])}},b=u({table:"ai_chats",id:"id",columns:{id:o("id"),connectionId:o("connection_id"),title:o("title"),createdAt:o("created_at"),updatedAt:o("updated_at")}}),q=u({table:"ai_messages",id:"id",columns:{id:o("id"),chatId:o("chat_id"),role:o("role"),content:o("content"),timestamp:o("timestamp"),query:d("query"),dashboardId:d("dashboard_id")}}),ce={async loadByConnection(e,a){return(await e.query("SELECT * FROM ai_chats WHERE connection_id = ? ORDER BY updated_at DESC",[a])).map(t=>b.mapRow(t))},saveChat(e,a){return b.save(e,a)},removeChat(e,a){return b.remove(e,a)},removeByConnection(e,a){return b.removeBy(e,"connection_id = ?",[a])},async loadMessages(e,a){return(await e.query("SELECT * FROM ai_messages WHERE chat_id = ? ORDER BY timestamp ASC",[a])).map(t=>q.mapRow(t))},async replaceAllMessages(e,a,s){const t=[{sql:"DELETE FROM ai_messages WHERE chat_id = ?",params:[a]}];for(const i of s)t.push({sql:q.insertSql,params:q.toParams(i)});await e.transaction(t)}};export{k as C,ce as a,oe as b,ie as c,de as d,Te as e,ne as f,P as g,z as h,te as i,se as p,Ee as q,re as s};
