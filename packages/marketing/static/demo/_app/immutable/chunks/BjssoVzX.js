const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./DKdY3bmn.js","./RciSkj6z.js","./Cyza1jiY.js","./DV-YQ2BS.js","./Ay-7V1Px.js","./PPVm8Dsz.js","./CLkBFwbF.js","./2iOLhxB2.js"])))=>i.map(i=>d[i]);
import{_ as r}from"./PPVm8Dsz.js";import{i as I}from"./BS3T5i3H.js";const S=1,u=[`CREATE TABLE IF NOT EXISTS schema_version (
    version INTEGER NOT NULL,
    migrated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,`CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
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
    save_ssh_key_passphrase INTEGER NOT NULL DEFAULT 0
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
    active_canvas_tab_id TEXT,
    active_visualize_tab_id TEXT,
    active_starter_tab_id TEXT,
    tab_order TEXT NOT NULL DEFAULT '[]'
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
    connection_id TEXT NOT NULL REFERENCES connections(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    query TEXT NOT NULL,
    parameters TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,"CREATE INDEX IF NOT EXISTS idx_saved_queries_connection ON saved_queries(connection_id)",`CREATE TABLE IF NOT EXISTS query_history (
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
  )`,`CREATE TABLE IF NOT EXISTS dashboards (
    id TEXT PRIMARY KEY,
    connection_id TEXT NOT NULL,
    name TEXT NOT NULL,
    viewport TEXT NOT NULL DEFAULT '{"x":0,"y":0,"zoom":1}',
    widgets TEXT NOT NULL DEFAULT '[]',
    date_filter TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,"CREATE INDEX IF NOT EXISTS idx_dashboards_connection ON dashboards(connection_id)"];async function v(a){if((await a.query("SELECT name FROM sqlite_master WHERE type='table' AND name='schema_version'")).length>0)return await y(a),!1;const i=u.map(t=>({sql:t}));return await a.transaction(i),!0}async function y(a){for(const i of u)await a.execute(i);const e=[{table:"project_state",column:"active_dashboard_tab_id",sql:"ALTER TABLE project_state ADD COLUMN active_dashboard_tab_id TEXT"}];for(const i of e)(await a.query(`PRAGMA table_info(${i.table})`)).some(n=>n.name===i.column)||await a.execute(i.sql)}let T=null,d=null;async function A(){return T||d||(d=(async()=>{let a;if(I()){const{getDataDir:i}=await r(async()=>{const{getDataDir:c}=await import("./DKdY3bmn.js").then(E=>E.E);return{getDataDir:c}},__vite__mapDeps([0,1]),import.meta.url),{TauriSqliteProvider:t}=await r(async()=>{const{TauriSqliteProvider:c}=await import("./Cyza1jiY.js");return{TauriSqliteProvider:c}},__vite__mapDeps([2,3,1]),import.meta.url),n=new t,o=await i();a=await n.open(`${o}/seaquel.db`)}else{const{WebSqliteProvider:i}=await r(async()=>{const{WebSqliteProvider:n}=await import("./Ay-7V1Px.js");return{WebSqliteProvider:n}},__vite__mapDeps([4,5]),import.meta.url);a=await new i().open("seaquel.db")}if(await a.execute("PRAGMA journal_mode=WAL"),await a.execute("PRAGMA foreign_keys=ON"),await v(a)){const{migrateJsonToSqlite:i}=await r(async()=>{const{migrateJsonToSqlite:t}=await import("./CLkBFwbF.js");return{migrateJsonToSqlite:t}},__vite__mapDeps([6,5,7]),import.meta.url);await i(a),await a.execute("INSERT INTO schema_version (version) VALUES (?)",[S])}else if((await a.query("SELECT COUNT(*) as count FROM connections"))[0].count===0){const{migrateJsonToSqlite:t}=await r(async()=>{const{migrateJsonToSqlite:n}=await import("./CLkBFwbF.js");return{migrateJsonToSqlite:n}},__vite__mapDeps([6,5,7]),import.meta.url);await t(a)}return T=a,a})(),d)}const f=Object.freeze(Object.defineProperty({__proto__:null,getDatabase:A},Symbol.toStringTag,{value:"Module"})),X={async loadAll(a){const e=await a.query("SELECT id, name, description, created_at, updated_at FROM projects"),i=[];for(const t of e){const n=await a.query("SELECT id, name, is_predefined, color FROM project_labels WHERE project_id = ?",[t.id]);i.push({id:t.id,name:t.name,description:t.description??void 0,createdAt:t.created_at,updatedAt:t.updated_at,customLabels:n.map(o=>({id:o.id,name:o.name,isPredefined:o.is_predefined===1,color:o.color}))})}return i},async save(a,e){await a.execute(`INSERT INTO projects (id, name, description, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         name = excluded.name,
         description = excluded.description,
         updated_at = excluded.updated_at`,[e.id,e.name,e.description??null,e.createdAt,e.updatedAt]),await a.execute("DELETE FROM project_labels WHERE project_id = ?",[e.id]);for(const i of e.customLabels)await a.execute(`INSERT INTO project_labels (id, project_id, name, is_predefined, color)
         VALUES (?, ?, ?, ?, ?)`,[i.id,e.id,i.name,i.isPredefined?1:0,i.color])},async saveAll(a,e){for(const i of e)await this.save(a,i)},async remove(a,e){await a.execute("DELETE FROM projects WHERE id = ?",[e])}},l={async get(a,e){const i=await a.query("SELECT value FROM app_state WHERE key = ?",[e]);return i.length===0?null:i[0].value},async set(a,e,i){await a.execute("INSERT OR REPLACE INTO app_state (key, value) VALUES (?, ?)",[e,i])}},C={async loadAll(a){const e=await a.query("SELECT * FROM connections"),i=[];for(const t of e){const n=await a.query("SELECT label_id FROM connection_labels WHERE connection_id = ?",[t.id]);i.push({id:t.id,projectId:t.project_id,name:t.name,type:t.type,host:t.host,port:t.port,databaseName:t.database_name,username:t.username,sslMode:t.ssl_mode??void 0,connectionString:t.connection_string??void 0,lastConnected:t.last_connected?new Date(t.last_connected):void 0,sshTunnel:t.ssh_tunnel?JSON.parse(t.ssh_tunnel):void 0,savePassword:t.save_password===1,saveSshPassword:t.save_ssh_password===1,saveSshKeyPassphrase:t.save_ssh_key_passphrase===1,labelIds:n.map(o=>o.label_id)})}return i},async save(a,e){await a.execute(`INSERT INTO connections
       (id, project_id, name, type, host, port, database_name, username, ssl_mode,
        connection_string, last_connected, ssh_tunnel, save_password, save_ssh_password,
        save_ssh_key_passphrase)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         project_id = excluded.project_id,
         name = excluded.name,
         type = excluded.type,
         host = excluded.host,
         port = excluded.port,
         database_name = excluded.database_name,
         username = excluded.username,
         ssl_mode = excluded.ssl_mode,
         connection_string = excluded.connection_string,
         last_connected = excluded.last_connected,
         ssh_tunnel = excluded.ssh_tunnel,
         save_password = excluded.save_password,
         save_ssh_password = excluded.save_ssh_password,
         save_ssh_key_passphrase = excluded.save_ssh_key_passphrase`,[e.id,e.projectId,e.name,e.type,e.host,e.port,e.databaseName,e.username,e.sslMode??null,e.connectionString??null,e.lastConnected instanceof Date?e.lastConnected.toISOString():e.lastConnected??null,e.sshTunnel?JSON.stringify(e.sshTunnel):null,e.savePassword?1:0,e.saveSshPassword?1:0,e.saveSshKeyPassphrase?1:0]),await a.execute("DELETE FROM connection_labels WHERE connection_id = ?",[e.id]);for(const i of e.labelIds)await a.execute("INSERT INTO connection_labels (connection_id, label_id) VALUES (?, ?)",[e.id,i])},async remove(a,e){await a.execute("DELETE FROM connections WHERE id = ?",[e])}},U={async load(a,e){const i=await a.query("SELECT * FROM project_state WHERE project_id = ?",[e]);if(i.length===0)return null;const t=i[0],n=await a.query("SELECT * FROM tabs WHERE project_id = ?",[e]),o=n.filter(s=>s.tab_type==="query").map(s=>({id:s.id,name:s.name,query:s.query??"",savedQueryId:s.saved_query_id??void 0,sharedQueryId:s.shared_query_id??void 0})),c=n.filter(s=>s.tab_type==="schema").map(s=>({id:s.id,tableName:s.table_name??"",schemaName:s.schema_name??""})),E=n.filter(s=>s.tab_type==="explain").map(s=>({id:s.id,name:s.name,sourceQuery:s.source_query??""})),p=n.filter(s=>s.tab_type==="erd").map(s=>({id:s.id,name:s.name,connectionId:s.connection_id??void 0})),N=n.filter(s=>s.tab_type==="statistics").map(s=>({id:s.id,name:s.name,connectionId:s.connection_id??""})),m=n.filter(s=>s.tab_type==="canvas").map(s=>({id:s.id,name:s.name,connectionId:s.connection_id??""})),L=n.filter(s=>s.tab_type==="starter").map(s=>({id:s.id,type:s.starter_type??"getting-started",name:s.name,closable:s.closable===1})),R=n.filter(s=>s.tab_type==="dashboard").map(s=>({id:s.id,name:s.name,connectionId:s.connection_id??"",dashboardId:s.source_query??""})),O=(await a.query("SELECT id, data FROM saved_canvases WHERE project_id = ?",[e])).map(s=>JSON.parse(s.data));let _=null;try{const s=await a.query("SELECT active_dashboard_tab_id FROM project_state WHERE project_id = ?",[e]);s.length>0&&(_=s[0].active_dashboard_tab_id)}catch{}return{projectId:e,queryTabs:o,schemaTabs:c,explainTabs:E,erdTabs:p,statisticsTabs:N,canvasTabs:m,tabOrder:JSON.parse(t.tab_order),activeQueryTabId:t.active_query_tab_id,activeSchemaTabId:t.active_schema_tab_id,activeExplainTabId:t.active_explain_tab_id,activeErdTabId:t.active_erd_tab_id,activeStatisticsTabId:t.active_statistics_tab_id,activeCanvasTabId:t.active_canvas_tab_id,activeView:t.active_view,activeConnectionId:t.active_connection_id,starterTabs:L,activeStarterTabId:t.active_starter_tab_id,savedCanvases:O,dashboardTabs:R,activeDashboardTabId:_}},async save(a,e){await a.execute(`INSERT OR REPLACE INTO project_state
       (project_id, active_view, active_connection_id, active_query_tab_id, active_schema_tab_id,
        active_explain_tab_id, active_erd_tab_id, active_statistics_tab_id, active_canvas_tab_id,
        active_visualize_tab_id, active_starter_tab_id, tab_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,[e.projectId,e.activeView,e.activeConnectionId,e.activeQueryTabId,e.activeSchemaTabId,e.activeExplainTabId,e.activeErdTabId,e.activeStatisticsTabId??null,e.activeCanvasTabId??null,null,e.activeStarterTabId??null,JSON.stringify(e.tabOrder)]);try{await a.execute("UPDATE project_state SET active_dashboard_tab_id = ? WHERE project_id = ?",[e.activeDashboardTabId??null,e.projectId])}catch{}await a.execute("DELETE FROM tabs WHERE project_id = ?",[e.projectId]);for(const i of e.queryTabs)await a.execute(`INSERT INTO tabs (id, project_id, tab_type, name, query, saved_query_id, shared_query_id)
         VALUES (?, ?, 'query', ?, ?, ?, ?)`,[i.id,e.projectId,i.name,i.query,i.savedQueryId??null,i.sharedQueryId??null]);for(const i of e.schemaTabs)await a.execute(`INSERT INTO tabs (id, project_id, tab_type, name, table_name, schema_name)
         VALUES (?, ?, 'schema', ?, ?, ?)`,[i.id,e.projectId,i.tableName,i.tableName,i.schemaName]);for(const i of e.explainTabs)await a.execute(`INSERT INTO tabs (id, project_id, tab_type, name, source_query)
         VALUES (?, ?, 'explain', ?, ?)`,[i.id,e.projectId,i.name,i.sourceQuery]);for(const i of e.erdTabs)await a.execute(`INSERT INTO tabs (id, project_id, tab_type, name, connection_id)
         VALUES (?, ?, 'erd', ?, ?)`,[i.id,e.projectId,i.name,i.connectionId??null]);for(const i of e.statisticsTabs??[])await a.execute(`INSERT INTO tabs (id, project_id, tab_type, name, connection_id)
         VALUES (?, ?, 'statistics', ?, ?)`,[i.id,e.projectId,i.name,i.connectionId]);for(const i of e.canvasTabs??[])await a.execute(`INSERT INTO tabs (id, project_id, tab_type, name, connection_id)
         VALUES (?, ?, 'canvas', ?, ?)`,[i.id,e.projectId,i.name,i.connectionId]);for(const i of e.starterTabs??[])await a.execute(`INSERT INTO tabs (id, project_id, tab_type, name, starter_type, closable)
         VALUES (?, ?, 'starter', ?, ?, ?)`,[i.id,e.projectId,i.name,i.type,i.closable?1:0]);for(const i of e.dashboardTabs??[])await a.execute(`INSERT INTO tabs (id, project_id, tab_type, name, connection_id, source_query)
         VALUES (?, ?, 'dashboard', ?, ?, ?)`,[i.id,e.projectId,i.name,i.connectionId,i.dashboardId]);await a.execute("DELETE FROM saved_canvases WHERE project_id = ?",[e.projectId]);for(const i of e.savedCanvases??[])await a.execute("INSERT INTO saved_canvases (id, project_id, data) VALUES (?, ?, ?)",[i.id??crypto.randomUUID(),e.projectId,JSON.stringify(i)])},async remove(a,e){await a.execute("DELETE FROM project_state WHERE project_id = ?",[e]),await a.execute("DELETE FROM tabs WHERE project_id = ?",[e]),await a.execute("DELETE FROM saved_canvases WHERE project_id = ?",[e])}},x={async loadByConnection(a,e){return(await a.query("SELECT * FROM saved_queries WHERE connection_id = ?",[e])).map(t=>({id:t.id,connectionId:t.connection_id,name:t.name,query:t.query,parameters:t.parameters?JSON.parse(t.parameters):void 0,createdAt:t.created_at,updatedAt:t.updated_at}))},async saveAll(a,e,i){await a.execute("DELETE FROM saved_queries WHERE connection_id = ?",[e]);for(const t of i)await a.execute(`INSERT INTO saved_queries (id, connection_id, name, query, parameters, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,[t.id,e,t.name,t.query,t.parameters?JSON.stringify(t.parameters):null,t.createdAt,t.updatedAt])},async removeByConnection(a,e){await a.execute("DELETE FROM saved_queries WHERE connection_id = ?",[e])}},F={async loadByConnection(a,e){return(await a.query("SELECT * FROM query_history WHERE connection_id = ? ORDER BY timestamp DESC",[e])).map(t=>({id:t.id,connectionId:t.connection_id,query:t.query,timestamp:t.timestamp,executionTime:t.execution_time,rowCount:t.row_count,favorite:t.favorite===1,connectionLabelsSnapshot:t.connection_labels_snapshot?JSON.parse(t.connection_labels_snapshot):[],connectionNameSnapshot:t.connection_name_snapshot}))},async replaceAll(a,e,i){await a.execute("DELETE FROM query_history WHERE connection_id = ?",[e]);for(const t of i)await a.execute(`INSERT INTO query_history
         (id, connection_id, query, timestamp, execution_time, row_count, favorite,
          connection_labels_snapshot, connection_name_snapshot)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,[t.id,e,t.query,t.timestamp,t.executionTime,t.rowCount,t.favorite?1:0,t.connectionLabelsSnapshot?JSON.stringify(t.connectionLabelsSnapshot):null,t.connectionNameSnapshot])},async removeByConnection(a,e){await a.execute("DELETE FROM query_history WHERE connection_id = ?",[e])}},D={async loadAll(a){const i=(await a.query("SELECT id, data FROM shared_repos")).map(n=>JSON.parse(n.data)),t=await l.get(a,"activeRepoId");return{repos:i,activeRepoId:t}},async saveAll(a,e,i){await a.execute("DELETE FROM shared_repos");for(const t of e)await a.execute("INSERT INTO shared_repos (id, data) VALUES (?, ?)",[t.id,JSON.stringify(t)]);await l.set(a,"activeRepoId",i)}},q={async loadPreferences(a){const e=await a.query("SELECT light_theme_id, dark_theme_id FROM theme_preferences WHERE id = 1");return e.length===0?null:{lightThemeId:e[0].light_theme_id,darkThemeId:e[0].dark_theme_id}},async savePreferences(a,e,i){await a.execute(`INSERT OR REPLACE INTO theme_preferences (id, light_theme_id, dark_theme_id)
       VALUES (1, ?, ?)`,[e,i])},async loadUserThemes(a){return(await a.query("SELECT id, data FROM user_themes")).map(i=>JSON.parse(i.data))},async saveUserThemes(a,e){await a.execute("DELETE FROM user_themes");for(const i of e){const t=i;await a.execute("INSERT INTO user_themes (id, data) VALUES (?, ?)",[t.id,JSON.stringify(i)])}}},g={async load(a){const e=await a.query("SELECT data FROM license_state WHERE id = 1");return e.length===0?null:JSON.parse(e[0].data)},async save(a,e){await a.execute("INSERT OR REPLACE INTO license_state (id, data) VALUES (1, ?)",[JSON.stringify(e)])}},j={async load(a){const e=await a.query("SELECT data FROM onboarding_state WHERE id = 1");return e.length===0?null:JSON.parse(e[0].data)},async save(a,e){await a.execute("INSERT OR REPLACE INTO onboarding_state (id, data) VALUES (1, ?)",[JSON.stringify(e)])}},M={async loadAll(a){return a.query("SELECT lesson_id as lessonId, challenge_id as challengeId, state FROM tutorial_progress")},async save(a,e,i,t){await a.execute(`INSERT OR REPLACE INTO tutorial_progress (lesson_id, challenge_id, state)
       VALUES (?, ?, ?)`,[e,i,t])},async removeLesson(a,e){await a.execute("DELETE FROM tutorial_progress WHERE lesson_id = ?",[e])},async removeAll(a){await a.execute("DELETE FROM tutorial_progress")}},P={async loadByConnection(a,e){return(await a.query("SELECT * FROM dashboards WHERE connection_id = ?",[e])).map(t=>({id:t.id,connectionId:t.connection_id,name:t.name,viewport:t.viewport,widgets:t.widgets,dateFilter:t.date_filter,createdAt:t.created_at,updatedAt:t.updated_at}))},async save(a,e){await a.execute(`INSERT INTO dashboards (id, connection_id, name, viewport, widgets, date_filter, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         name = excluded.name,
         viewport = excluded.viewport,
         widgets = excluded.widgets,
         date_filter = excluded.date_filter,
         updated_at = excluded.updated_at`,[e.id,e.connectionId,e.name,e.viewport,e.widgets,e.dateFilter??null,e.createdAt,e.updatedAt])},async remove(a,e){await a.execute("DELETE FROM dashboards WHERE id = ?",[e])},async removeByConnection(a,e){await a.execute("DELETE FROM dashboards WHERE connection_id = ?",[e])}},H={async load(a,e){const i=await a.query("SELECT has_offered_import, last_check_timestamp FROM import_state WHERE source = ?",[e]);return i.length===0?null:{hasOfferedImport:i[0].has_offered_import===1,lastCheckTimestamp:i[0].last_check_timestamp}},async save(a,e,i,t){await a.execute(`INSERT OR REPLACE INTO import_state (source, has_offered_import, last_check_timestamp)
       VALUES (?, ?, ?)`,[e,i?1:0,t])}};export{l as a,U as b,C as c,D as d,M as e,P as f,A as g,f as h,H as i,g as l,j as o,X as p,F as q,x as s,q as t};
