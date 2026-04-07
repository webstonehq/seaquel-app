const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./CsDxym66.js","./RciSkj6z.js","./CxhofKxe.js","./DLlEFENd.js","./Coza8G6G.js","./PPVm8Dsz.js","./DQhy5hSO.js","./BHOGl2pX.js","./CErnpSF8.js","./C_Uvb4WO.js","./XOPl3CLQ.js","./BSVBbVFJ.js","./CE1G-McA.js"])))=>i.map(i=>d[i]);
import{_ as A}from"./PPVm8Dsz.js";import{i as K}from"./CErnpSF8.js";const $=4,k=[`CREATE TABLE IF NOT EXISTS schema_version (
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
  )`,"CREATE INDEX IF NOT EXISTS idx_ai_chats_connection ON ai_chats(connection_id)",`CREATE TABLE IF NOT EXISTS ai_messages (
    id TEXT PRIMARY KEY,
    chat_id TEXT NOT NULL REFERENCES ai_chats(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    query TEXT
  )`,"CREATE INDEX IF NOT EXISTS idx_ai_messages_chat ON ai_messages(chat_id)"];async function J(a){if((await a.query("SELECT name FROM sqlite_master WHERE type='table' AND name='schema_version'")).length>0)return await Q(a),!1;const s=k.map(t=>({sql:t}));return await a.transaction(s),!0}async function Q(a){const e=[{table:"project_state",column:"active_dashboard_tab_id",sql:"ALTER TABLE project_state ADD COLUMN active_dashboard_tab_id TEXT"},{table:"projects",column:"git_repo_path",sql:"ALTER TABLE projects ADD COLUMN git_repo_path TEXT"},{table:"connections",column:"is_local_only",sql:"ALTER TABLE connections ADD COLUMN is_local_only INTEGER NOT NULL DEFAULT 0"},{table:"connections",column:"shared_connection_id",sql:"ALTER TABLE connections ADD COLUMN shared_connection_id TEXT"},{table:"saved_queries",column:"starred",sql:"ALTER TABLE saved_queries ADD COLUMN starred INTEGER NOT NULL DEFAULT 0"},{table:"project_state",column:"starred_shared_query_ids",sql:"ALTER TABLE project_state ADD COLUMN starred_shared_query_ids TEXT NOT NULL DEFAULT '[]'"},{table:"project_state",column:"starred_shared_dashboard_ids",sql:"ALTER TABLE project_state ADD COLUMN starred_shared_dashboard_ids TEXT NOT NULL DEFAULT '[]'"},{table:"dashboards",column:"starred",sql:"ALTER TABLE dashboards ADD COLUMN starred INTEGER DEFAULT 0"},{table:"connections",column:"ai_share_schema",sql:"ALTER TABLE connections ADD COLUMN ai_share_schema INTEGER"},{table:"connections",column:"ai_share_data",sql:"ALTER TABLE connections ADD COLUMN ai_share_data INTEGER"},{table:"connections",column:"active_ai_provider_id",sql:"ALTER TABLE connections ADD COLUMN active_ai_provider_id TEXT"},{table:"connections",column:"active_ai_model",sql:"ALTER TABLE connections ADD COLUMN active_ai_model TEXT"},{table:"project_state",column:"pane_layout",sql:"ALTER TABLE project_state ADD COLUMN pane_layout TEXT"},{table:"dashboards",column:"shared",sql:"ALTER TABLE dashboards ADD COLUMN shared INTEGER NOT NULL DEFAULT 0"},{table:"dashboards",column:"description",sql:"ALTER TABLE dashboards ADD COLUMN description TEXT"},{table:"saved_queries",column:"shared",sql:"ALTER TABLE saved_queries ADD COLUMN shared INTEGER NOT NULL DEFAULT 0"},{table:"saved_queries",column:"description",sql:"ALTER TABLE saved_queries ADD COLUMN description TEXT"},{table:"saved_queries",column:"database_type",sql:"ALTER TABLE saved_queries ADD COLUMN database_type TEXT"},{table:"saved_queries",column:"tags",sql:"ALTER TABLE saved_queries ADD COLUMN tags TEXT"},{table:"saved_queries",column:"folder",sql:"ALTER TABLE saved_queries ADD COLUMN folder TEXT"},{table:"project_state",column:"active_create_table_tab_id",sql:"ALTER TABLE project_state ADD COLUMN active_create_table_tab_id TEXT"},{table:"project_state",column:"active_data_tab_id",sql:"ALTER TABLE project_state ADD COLUMN active_data_tab_id TEXT"}];for(const n of e)(await a.query(`PRAGMA table_info(${n.table})`)).some(m=>m.name===n.column)||await a.execute(n.sql);const s=await a.query("PRAGMA table_info(saved_queries)");s.some(n=>n.name==="connection_id")&&!s.some(n=>n.name==="project_id")&&(await a.execute("ALTER TABLE saved_queries ADD COLUMN project_id TEXT"),await a.execute(`UPDATE saved_queries SET project_id = (
        SELECT project_id FROM connections WHERE connections.id = saved_queries.connection_id
      ) WHERE project_id IS NULL`),await a.execute("DELETE FROM saved_queries WHERE project_id IS NULL")),s.some(n=>n.name==="connection_id")&&(await a.execute("DROP INDEX IF EXISTS idx_saved_queries_connection"),await a.execute("ALTER TABLE saved_queries DROP COLUMN connection_id"));const t=await a.query("PRAGMA table_info(dashboards)");t.some(n=>n.name==="connection_id")&&!t.some(n=>n.name==="project_id")&&(await a.execute("ALTER TABLE dashboards ADD COLUMN project_id TEXT"),await a.execute(`UPDATE dashboards SET project_id = (
        SELECT project_id FROM connections WHERE connections.id = dashboards.connection_id
      ) WHERE project_id IS NULL`),await a.execute("DELETE FROM dashboards WHERE project_id IS NULL")),t.some(n=>n.name==="connection_id")&&(await a.execute("DROP INDEX IF EXISTS idx_dashboards_connection"),await a.execute("ALTER TABLE dashboards DROP COLUMN connection_id"));const i=await a.query("PRAGMA table_info(project_state)");i.some(n=>n.name==="active_canvas_tab_id")&&!i.some(n=>n.name==="active_workflow_tab_id")&&await a.execute("ALTER TABLE project_state RENAME COLUMN active_canvas_tab_id TO active_workflow_tab_id"),await a.execute("UPDATE project_state SET active_view = 'workflow' WHERE active_view = 'canvas'");for(const n of k)await a.execute(n)}let P=null,w=null;async function z(){return P||w||(w=(async()=>{let a;if(K()){const{getDataDir:s}=await A(async()=>{const{getDataDir:l}=await import("./CsDxym66.js");return{getDataDir:l}},__vite__mapDeps([0,1,2]),import.meta.url),{TauriSqliteProvider:t}=await A(async()=>{const{TauriSqliteProvider:l}=await import("./DLlEFENd.js");return{TauriSqliteProvider:l}},__vite__mapDeps([3,1]),import.meta.url),i=new t,n=await s();a=await i.open(`${n}/seaquel.db`)}else{const{WebSqliteProvider:s}=await A(async()=>{const{WebSqliteProvider:i}=await import("./Coza8G6G.js");return{WebSqliteProvider:i}},__vite__mapDeps([4,5]),import.meta.url);a=await new s().open("seaquel.db")}if(await a.execute("PRAGMA journal_mode=WAL"),await a.execute("PRAGMA foreign_keys=ON"),await J(a)){const{migrateJsonToSqlite:s}=await A(async()=>{const{migrateJsonToSqlite:t}=await import("./DQhy5hSO.js");return{migrateJsonToSqlite:t}},__vite__mapDeps([6,5,7,8,9,10]),import.meta.url);await s(a),await a.execute("INSERT INTO schema_version (version) VALUES (?)",[$])}else if((await a.query("SELECT COUNT(*) as count FROM connections"))[0].count===0){const{migrateJsonToSqlite:t}=await A(async()=>{const{migrateJsonToSqlite:i}=await import("./DQhy5hSO.js");return{migrateJsonToSqlite:i}},__vite__mapDeps([6,5,7,8,9,10]),import.meta.url);await t(a)}return P=a,a})(),w)}const me=Object.freeze(Object.defineProperty({__proto__:null,getDatabase:z},Symbol.toStringTag,{value:"Module"}));function p(a,e){if(!a)return e;try{return JSON.parse(a)}catch{return e}}function r(a){return{dbColumn:a,toDb:e=>e,fromDb:e=>e}}function T(a){return{dbColumn:a,toDb:e=>e??null,fromDb:e=>e??void 0}}function L(a){return{dbColumn:a,toDb:e=>e?1:0,fromDb:e=>e===1}}function G(a){return{dbColumn:a,toDb:e=>e==null?null:e?1:0,fromDb:e=>e==null?void 0:e===1}}function H(a,e){return{dbColumn:a,toDb:s=>s==null?null:JSON.stringify(s),fromDb:s=>typeof s=="string"?p(s,e):s??e}}function N(a){const{table:e,id:s,columns:t}=a,i=Object.keys(t),n=i.map(d=>t[d]),l=n.map(d=>d.dbColumn),m=t[s],u=l.join(", "),R=l.map(()=>"?").join(", "),_=n.filter(d=>d.dbColumn!==m.dbColumn).map(d=>`${d.dbColumn} = excluded.${d.dbColumn}`).join(`,
         `),b=`INSERT INTO ${e} (${u})
       VALUES (${R})
       ON CONFLICT(${m.dbColumn}) DO UPDATE SET
         ${_}`,j=`INSERT INTO ${e} (${u})
       VALUES (${R})`;function v(d){const c={};for(let E=0;E<i.length;E++)c[i[E]]=n[E].fromDb(d[n[E].dbColumn]);return c}function h(d){return i.map((c,E)=>n[E].toDb(d[c]))}async function V(d){return(await d.query(`SELECT ${u} FROM ${e}`)).map(v)}async function M(d,c,E){return(await d.query(`SELECT ${u} FROM ${e} WHERE ${c}`,E)).map(v)}async function y(d,c,E){const g=await d.query(`SELECT ${u} FROM ${e} WHERE ${c}`,E);return g.length===0?null:v(g[0])}async function O(d,c){await d.execute(b,h(c))}async function I(d,c){for(const E of c)await O(d,E)}async function S(d,c){await d.execute(`DELETE FROM ${e} WHERE ${m.dbColumn} = ?`,[c])}async function o(d,c,E){await d.execute(`DELETE FROM ${e} WHERE ${c}`,E)}return{table:e,upsertSql:b,insertSql:j,mapRow:v,toParams:h,loadAll:V,loadBy:M,loadOneBy:y,save:O,saveAll:I,remove:S,removeBy:o}}const B=N({table:"projects",id:"id",columns:{id:r("id"),name:r("name"),description:T("description"),createdAt:r("created_at"),updatedAt:r("updated_at"),gitRepoPath:T("git_repo_path")}}),Z={async loadAll(a){const e=await B.loadAll(a),s=[];for(const t of e){const i=await a.query("SELECT id, name, is_predefined, color FROM project_labels WHERE project_id = ?",[t.id]);s.push({...t,customLabels:i.map(n=>({id:n.id,name:n.name,isPredefined:n.is_predefined===1,color:n.color}))})}return s},async save(a,e){const{customLabels:s,...t}=e;await B.save(a,t),await a.execute("DELETE FROM project_labels WHERE project_id = ?",[e.id]);for(const i of s)await a.execute(`INSERT INTO project_labels (id, project_id, name, is_predefined, color)
         VALUES (?, ?, ?, ?, ?)`,[i.id,e.id,i.name,i.isPredefined?1:0,i.color])},async saveAll(a,e){for(const s of e)await this.save(a,s)},async remove(a,e){await B.remove(a,e)}},Y={async get(a,e){const s=await a.query("SELECT value FROM app_state WHERE key = ?",[e]);return s.length===0?null:s[0].value},async set(a,e,s){await a.execute("INSERT OR REPLACE INTO app_state (key, value) VALUES (?, ?)",[e,s])}},x=N({table:"connections",id:"id",columns:{id:r("id"),projectId:r("project_id"),name:r("name"),type:r("type"),host:r("host"),port:r("port"),databaseName:r("database_name"),username:r("username"),sslMode:T("ssl_mode"),connectionString:T("connection_string"),lastConnected:{dbColumn:"last_connected",toDb:a=>a instanceof Date?a.toISOString():a??null,fromDb:a=>a?new Date(a):void 0},sshTunnel:{dbColumn:"ssh_tunnel",toDb:a=>a?JSON.stringify(a):null,fromDb:a=>p(a,void 0)},savePassword:L("save_password"),saveSshPassword:L("save_ssh_password"),saveSshKeyPassphrase:L("save_ssh_key_passphrase"),isLocalOnly:{dbColumn:"is_local_only",toDb:a=>a?1:0,fromDb:a=>a===1?!0:void 0},sharedConnectionId:T("shared_connection_id"),aiShareSchema:G("ai_share_schema"),aiShareData:G("ai_share_data"),activeAIProviderId:T("active_ai_provider_id"),activeAIModel:T("active_ai_model")}}),ee={async loadAll(a){const e=await x.loadAll(a),s=[];for(const t of e){const i=await a.query("SELECT label_id FROM connection_labels WHERE connection_id = ?",[t.id]);s.push({...t,labelIds:i.map(n=>n.label_id)})}return s},async save(a,e){const{labelIds:s,...t}=e;await x.save(a,t),await a.execute("DELETE FROM connection_labels WHERE connection_id = ?",[e.id]);for(const i of s)await a.execute("INSERT INTO connection_labels (connection_id, label_id) VALUES (?, ?)",[e.id,i])},async remove(a,e){await x.remove(a,e)}},ae={async load(a,e){const s=await a.query("SELECT * FROM project_state WHERE project_id = ?",[e]);if(s.length===0)return null;const t=s[0],i=await a.query("SELECT * FROM tabs WHERE project_id = ?",[e]),n=i.filter(o=>o.tab_type==="query").map(o=>({id:o.id,name:o.name,query:o.query??"",queryId:o.saved_query_id??o.shared_query_id??void 0})),l=i.filter(o=>o.tab_type==="schema").map(o=>({id:o.id,tableName:o.table_name??"",schemaName:o.schema_name??""})),m=i.filter(o=>o.tab_type==="explain").map(o=>({id:o.id,name:o.name,sourceQuery:o.source_query??""})),u=i.filter(o=>o.tab_type==="erd").map(o=>({id:o.id,name:o.name,connectionId:o.connection_id??void 0})),R=i.filter(o=>o.tab_type==="statistics").map(o=>({id:o.id,name:o.name,connectionId:o.connection_id??""})),_=i.filter(o=>o.tab_type==="canvas").map(o=>({id:o.id,name:o.name,connectionId:o.connection_id??""})),b=i.filter(o=>o.tab_type==="starter").map(o=>({id:o.id,type:o.starter_type??"getting-started",name:o.name,closable:o.closable===1})),j=i.filter(o=>o.tab_type==="dashboard").map(o=>({id:o.id,name:o.name,dashboardId:o.source_query??""})),v=i.filter(o=>o.tab_type==="create_table").map(o=>({id:o.id,connectionId:o.connection_id??"",name:o.name,tableDefinition:o.source_query??"{}"})),h=i.filter(o=>o.tab_type==="data").map(o=>({id:o.id,connectionId:o.connection_id??"",tableName:o.table_name??"",schemaName:o.schema_name??""})),M=(await a.query("SELECT id, data FROM saved_canvases WHERE project_id = ?",[e])).map(o=>p(o.data,null)).filter(o=>o!==null);let y=null;try{const o=await a.query("SELECT active_dashboard_tab_id FROM project_state WHERE project_id = ?",[e]);o.length>0&&(y=o[0].active_dashboard_tab_id)}catch{}let O=[];try{const o=await a.query("SELECT starred_shared_query_ids FROM project_state WHERE project_id = ?",[e]);o.length>0&&(O=p(o[0].starred_shared_query_ids,[]))}catch{}let I=[];try{const o=await a.query("SELECT starred_shared_dashboard_ids FROM project_state WHERE project_id = ?",[e]);o.length>0&&(I=p(o[0].starred_shared_dashboard_ids,[]))}catch{}let S;try{const o=await a.query("SELECT pane_layout FROM project_state WHERE project_id = ?",[e]);o.length>0&&o[0].pane_layout&&(S=p(o[0].pane_layout,void 0))}catch{}return{projectId:e,queryTabs:n,schemaTabs:l,explainTabs:m,erdTabs:u,statisticsTabs:R,workflowTabs:_,tabOrder:p(t.tab_order,[]),activeQueryTabId:t.active_query_tab_id,activeSchemaTabId:t.active_schema_tab_id,activeExplainTabId:t.active_explain_tab_id,activeErdTabId:t.active_erd_tab_id,activeStatisticsTabId:t.active_statistics_tab_id,activeWorkflowTabId:t.active_workflow_tab_id,activeView:t.active_view,activeConnectionId:t.active_connection_id,starterTabs:b,activeStarterTabId:t.active_starter_tab_id,savedWorkflows:M,dashboardTabs:j,activeDashboardTabId:y,createTableTabs:v,activeCreateTableTabId:t.active_create_table_tab_id??null,dataTabs:h,activeDataTabId:t.active_data_tab_id??null,starredSharedQueryIds:O,starredSharedDashboardIds:I,paneLayout:S}},async save(a,e){const s=[];s.push({sql:`INSERT OR REPLACE INTO project_state
       (project_id, active_view, active_connection_id, active_query_tab_id, active_schema_tab_id,
        active_explain_tab_id, active_erd_tab_id, active_statistics_tab_id, active_workflow_tab_id,
        active_visualize_tab_id, active_starter_tab_id, tab_order,
        active_dashboard_tab_id, starred_shared_query_ids, starred_shared_dashboard_ids, pane_layout,
        active_create_table_tab_id, active_data_tab_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,params:[e.projectId,e.activeView,e.activeConnectionId,e.activeQueryTabId,e.activeSchemaTabId,e.activeExplainTabId,e.activeErdTabId,e.activeStatisticsTabId??null,e.activeWorkflowTabId??null,null,e.activeStarterTabId??null,JSON.stringify(e.tabOrder),e.activeDashboardTabId??null,JSON.stringify(e.starredSharedQueryIds??[]),JSON.stringify(e.starredSharedDashboardIds??[]),e.paneLayout?JSON.stringify(e.paneLayout):null,e.activeCreateTableTabId??null,e.activeDataTabId??null]}),s.push({sql:"DELETE FROM tabs WHERE project_id = ?",params:[e.projectId]});for(const t of e.queryTabs)s.push({sql:"INSERT INTO tabs (id, project_id, tab_type, name, query, saved_query_id) VALUES (?, ?, 'query', ?, ?, ?)",params:[t.id,e.projectId,t.name,t.query,t.queryId??null]});for(const t of e.schemaTabs)s.push({sql:"INSERT INTO tabs (id, project_id, tab_type, name, table_name, schema_name) VALUES (?, ?, 'schema', ?, ?, ?)",params:[t.id,e.projectId,t.tableName,t.tableName,t.schemaName]});for(const t of e.explainTabs)s.push({sql:"INSERT INTO tabs (id, project_id, tab_type, name, source_query) VALUES (?, ?, 'explain', ?, ?)",params:[t.id,e.projectId,t.name,t.sourceQuery]});for(const t of e.erdTabs)s.push({sql:"INSERT INTO tabs (id, project_id, tab_type, name, connection_id) VALUES (?, ?, 'erd', ?, ?)",params:[t.id,e.projectId,t.name,t.connectionId??null]});for(const t of e.statisticsTabs??[])s.push({sql:"INSERT INTO tabs (id, project_id, tab_type, name, connection_id) VALUES (?, ?, 'statistics', ?, ?)",params:[t.id,e.projectId,t.name,t.connectionId]});for(const t of e.workflowTabs??[])s.push({sql:"INSERT INTO tabs (id, project_id, tab_type, name, connection_id) VALUES (?, ?, 'canvas', ?, ?)",params:[t.id,e.projectId,t.name,t.connectionId]});for(const t of e.starterTabs??[])s.push({sql:"INSERT INTO tabs (id, project_id, tab_type, name, starter_type, closable) VALUES (?, ?, 'starter', ?, ?, ?)",params:[t.id,e.projectId,t.name,t.type,t.closable?1:0]});for(const t of e.dashboardTabs??[])s.push({sql:"INSERT INTO tabs (id, project_id, tab_type, name, source_query) VALUES (?, ?, 'dashboard', ?, ?)",params:[t.id,e.projectId,t.name,t.dashboardId]});for(const t of e.createTableTabs??[])s.push({sql:"INSERT INTO tabs (id, project_id, tab_type, name, connection_id, source_query) VALUES (?, ?, 'create_table', ?, ?, ?)",params:[t.id,e.projectId,t.name,t.connectionId,t.tableDefinition]});for(const t of e.dataTabs??[])s.push({sql:"INSERT INTO tabs (id, project_id, tab_type, name, connection_id, table_name, schema_name) VALUES (?, ?, 'data', ?, ?, ?, ?)",params:[t.id,e.projectId,t.tableName,t.connectionId,t.tableName,t.schemaName]});s.push({sql:"DELETE FROM saved_canvases WHERE project_id = ?",params:[e.projectId]});for(const t of e.savedWorkflows??[])s.push({sql:"INSERT INTO saved_canvases (id, project_id, data) VALUES (?, ?, ?)",params:[t.id??`workflow-${crypto.randomUUID()}`,e.projectId,JSON.stringify(t)]});await a.transaction(s)},async remove(a,e){await a.execute("DELETE FROM project_state WHERE project_id = ?",[e]),await a.execute("DELETE FROM tabs WHERE project_id = ?",[e]),await a.execute("DELETE FROM saved_canvases WHERE project_id = ?",[e])}},D=N({table:"saved_queries",id:"id",columns:{id:r("id"),projectId:r("project_id"),name:r("name"),query:r("query"),parameters:H("parameters",void 0),starred:L("starred"),shared:L("shared"),description:T("description"),databaseType:T("database_type"),tags:H("tags",void 0),folder:T("folder"),createdAt:r("created_at"),updatedAt:r("updated_at")}}),te={async loadByProject(a,e){return D.loadBy(a,"project_id = ?",[e])},async saveAll(a,e,s){const t=s.map(n=>n.id),i=[];if(t.length>0){const n=t.map(()=>"?").join(",");i.push({sql:`DELETE FROM saved_queries WHERE project_id = ? AND id NOT IN (${n})`,params:[e,...t]})}else i.push({sql:"DELETE FROM saved_queries WHERE project_id = ?",params:[e]});for(const n of s)i.push({sql:D.upsertSql,params:D.toParams(n)});await a.transaction(i)},async removeByProject(a,e){return D.removeBy(a,"project_id = ?",[e])}},f=N({table:"query_versions",id:"id",columns:{id:r("id"),queryId:r("saved_query_id"),version:r("version"),snapshot:r("snapshot"),diff:r("diff"),createdAt:r("created_at")}}),se={async loadByQuery(a,e){return(await a.query("SELECT * FROM query_versions WHERE saved_query_id = ? ORDER BY version ASC",[e])).map(t=>f.mapRow(t))},async loadByProject(a,e){return(await a.query(`SELECT qv.* FROM query_versions qv
       JOIN saved_queries sq ON sq.id = qv.saved_query_id
       WHERE sq.project_id = ?
       ORDER BY qv.saved_query_id, qv.version ASC`,[e])).map(t=>f.mapRow(t))},async insert(a,e){await a.execute(f.insertSql,f.toParams(e))},async pruneOldVersions(a,e,s){const t=await this.loadByQuery(a,e);if(t.length<=s)return;const i=[...t].sort((_,b)=>b.version-_.version),n=i[s-1]?.version;if(n===void 0)return;const{resolveVersions:l}=await A(async()=>{const{resolveVersions:_}=await import("./BSVBbVFJ.js");return{resolveVersions:_}},__vite__mapDeps([11,12]),import.meta.url),m=l(t.map(_=>({..._,createdAt:new Date(_.createdAt)}))),u=i[s-1],R=m.find(_=>_.id===u.id);await a.execute(`DELETE FROM query_versions
       WHERE saved_query_id = ?
         AND version < ?`,[e,n]),u.snapshot===null&&R&&await a.execute("UPDATE query_versions SET snapshot = ?, diff = NULL WHERE id = ?",[R.query,u.id])}},q=N({table:"query_history",id:"id",columns:{id:r("id"),query:r("query"),timestamp:r("timestamp"),executionTime:r("execution_time"),rowCount:r("row_count"),connectionId:r("connection_id"),favorite:L("favorite"),connectionLabelsSnapshot:H("connection_labels_snapshot",[]),connectionNameSnapshot:r("connection_name_snapshot")}}),oe={async loadByConnection(a,e){return(await a.query("SELECT * FROM query_history WHERE connection_id = ? ORDER BY timestamp DESC",[e])).map(t=>q.mapRow(t))},async replaceAll(a,e,s){const t=[{sql:"DELETE FROM query_history WHERE connection_id = ?",params:[e]}];for(const i of s)t.push({sql:q.insertSql,params:q.toParams(i)});await a.transaction(t)},async removeByConnection(a,e){await q.removeBy(a,"connection_id = ?",[e])}},ie={async loadAll(a){const s=(await a.query("SELECT id, data FROM shared_repos")).map(i=>p(i.data,null)).filter(i=>i!==null),t=await Y.get(a,"activeRepoId");return{repos:s,activeRepoId:t}},async saveAll(a,e,s){const t=[{sql:"DELETE FROM shared_repos"}];for(const i of e)t.push({sql:"INSERT INTO shared_repos (id, data) VALUES (?, ?)",params:[i.id,JSON.stringify(i)]});await a.transaction(t),await Y.set(a,"activeRepoId",s)}},re={async loadPreferences(a){const e=await a.query("SELECT light_theme_id, dark_theme_id FROM theme_preferences WHERE id = 1");return e.length===0?null:{lightThemeId:e[0].light_theme_id,darkThemeId:e[0].dark_theme_id}},async savePreferences(a,e,s){await a.execute(`INSERT OR REPLACE INTO theme_preferences (id, light_theme_id, dark_theme_id)
       VALUES (1, ?, ?)`,[e,s])},async loadUserThemes(a){return(await a.query("SELECT id, data FROM user_themes")).map(s=>p(s.data,null)).filter(s=>s!==null)},async saveUserThemes(a,e){const s=[{sql:"DELETE FROM user_themes"}];for(const t of e){const i=t;s.push({sql:"INSERT INTO user_themes (id, data) VALUES (?, ?)",params:[i.id,JSON.stringify(t)]})}await a.transaction(s)}},ne={async load(a){const e=await a.query("SELECT data FROM license_state WHERE id = 1");return e.length===0?null:p(e[0].data,null)},async save(a,e){await a.execute("INSERT OR REPLACE INTO license_state (id, data) VALUES (1, ?)",[JSON.stringify(e)])}},de={async load(a){const e=await a.query("SELECT data FROM onboarding_state WHERE id = 1");return e.length===0?null:p(e[0].data,null)},async save(a,e){await a.execute("INSERT OR REPLACE INTO onboarding_state (id, data) VALUES (1, ?)",[JSON.stringify(e)])}},ce={async loadAll(a){return a.query("SELECT lesson_id as lessonId, challenge_id as challengeId, state FROM tutorial_progress")},async save(a,e,s,t){await a.execute(`INSERT OR REPLACE INTO tutorial_progress (lesson_id, challenge_id, state)
       VALUES (?, ?, ?)`,[e,s,t])},async removeLesson(a,e){await a.execute("DELETE FROM tutorial_progress WHERE lesson_id = ?",[e])},async removeAll(a){await a.execute("DELETE FROM tutorial_progress")}};function Ee(a){return{dbColumn:a,toDb:e=>e??null,fromDb:e=>e}}const U=N({table:"dashboards",id:"id",columns:{id:r("id"),projectId:r("project_id"),name:r("name"),viewport:r("viewport"),widgets:r("widgets"),dateFilter:Ee("date_filter"),starred:L("starred"),shared:L("shared"),description:T("description"),createdAt:r("created_at"),updatedAt:r("updated_at")}}),Te={loadByProject(a,e){return U.loadBy(a,"project_id = ?",[e])},save(a,e){return U.save(a,e)},remove(a,e){return U.remove(a,e)},removeByProject(a,e){return U.removeBy(a,"project_id = ?",[e])}},C=N({table:"dashboard_versions",id:"id",columns:{id:r("id"),dashboardId:r("dashboard_id"),version:r("version"),snapshot:r("snapshot"),createdAt:r("created_at")}}),_e={async loadByDashboard(a,e){return(await a.query("SELECT * FROM dashboard_versions WHERE dashboard_id = ? ORDER BY version ASC",[e])).map(t=>C.mapRow(t))},async loadByProject(a,e){return(await a.query(`SELECT dv.* FROM dashboard_versions dv
       JOIN dashboards d ON d.id = dv.dashboard_id
       WHERE d.project_id = ?
       ORDER BY dv.dashboard_id, dv.version ASC`,[e])).map(t=>C.mapRow(t))},async insert(a,e){await a.execute(C.insertSql,C.toParams(e))},async pruneOldVersions(a,e,s){await a.execute(`DELETE FROM dashboard_versions
       WHERE dashboard_id = ?
         AND version <= (
           SELECT version FROM dashboard_versions
           WHERE dashboard_id = ?
           ORDER BY version DESC
           LIMIT 1 OFFSET ?
         )`,[e,e,s])}},X=N({table:"connection_overrides",id:"sharedConnectionId",columns:{sharedConnectionId:r("shared_connection_id"),username:T("username"),hostOverride:T("host_override"),portOverride:T("port_override"),savePassword:L("save_password"),saveSshPassword:L("save_ssh_password"),saveSshKeyPassphrase:L("save_ssh_key_passphrase")}}),le={load(a,e){return X.loadOneBy(a,"shared_connection_id = ?",[e])},loadAll(a){return X.loadAll(a)},save(a,e){return X.save(a,e)},remove(a,e){return X.remove(a,e)}},ue={async load(a,e){const s=await a.query("SELECT has_offered_import, last_check_timestamp FROM import_state WHERE source = ?",[e]);return s.length===0?null:{hasOfferedImport:s[0].has_offered_import===1,lastCheckTimestamp:s[0].last_check_timestamp}},async save(a,e,s,t){await a.execute(`INSERT OR REPLACE INTO import_state (source, has_offered_import, last_check_timestamp)
       VALUES (?, ?, ?)`,[e,s?1:0,t])}},F=N({table:"ai_chats",id:"id",columns:{id:r("id"),connectionId:r("connection_id"),title:r("title"),createdAt:r("created_at"),updatedAt:r("updated_at")}}),W=N({table:"ai_messages",id:"id",columns:{id:r("id"),chatId:r("chat_id"),role:r("role"),content:r("content"),timestamp:r("timestamp"),query:T("query")}}),pe={async loadByConnection(a,e){return(await a.query("SELECT * FROM ai_chats WHERE connection_id = ? ORDER BY updated_at DESC",[e])).map(t=>F.mapRow(t))},saveChat(a,e){return F.save(a,e)},removeChat(a,e){return F.remove(a,e)},removeByConnection(a,e){return F.removeBy(a,"connection_id = ?",[e])},async loadMessages(a,e){return(await a.query("SELECT * FROM ai_messages WHERE chat_id = ? ORDER BY timestamp ASC",[e])).map(t=>W.mapRow(t))},async replaceAllMessages(a,e,s){const t=[{sql:"DELETE FROM ai_messages WHERE chat_id = ?",params:[e]}];for(const i of s)t.push({sql:W.insertSql,params:W.toParams(i)});await a.transaction(t)}},Re=Object.freeze(Object.defineProperty({__proto__:null,aiChatsRepo:pe,appStateRepo:Y,connectionOverridesRepo:le,connectionsRepo:ee,dashboardVersionsRepo:_e,dashboardsRepo:Te,importStateRepo:ue,licenseRepo:ne,onboardingRepo:de,projectStateRepo:ae,projectsRepo:Z,queryHistoryRepo:oe,queryVersionsRepo:se,savedQueriesRepo:te,sharedReposRepo:ie,themeRepo:re,tutorialRepo:ce},Symbol.toStringTag,{value:"Module"}));export{$ as C,Y as a,ae as b,ee as c,ie as d,ce as e,Te as f,z as g,se as h,ue as i,_e as j,pe as k,ne as l,le as m,me as n,de as o,Z as p,oe as q,Re as r,te as s,re as t};
