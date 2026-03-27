const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./Bjg-aFyn.js","./RciSkj6z.js","./CxhofKxe.js","./BHQ_a87B.js","./Ay-7V1Px.js","./PPVm8Dsz.js","./B1O-cZRg.js","./CmNF-8sc.js","./De6g2ANf.js","./2EpiHLd9.js","./7ivMX4dg.js","./DMn9TPGl.js","./Db73Mrdx.js","./Cpj98o6Y.js"])))=>i.map(i=>d[i]);
import{_ as E}from"./PPVm8Dsz.js";import{i as S}from"./De6g2ANf.js";const I=4,O=[`CREATE TABLE IF NOT EXISTS schema_version (
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
  )`,"CREATE INDEX IF NOT EXISTS idx_ai_messages_chat ON ai_messages(chat_id)"];async function w(a){if((await a.query("SELECT name FROM sqlite_master WHERE type='table' AND name='schema_version'")).length>0)return await D(a),!1;const s=O.map(t=>({sql:t}));return await a.transaction(s),!0}async function D(a){const e=[{table:"project_state",column:"active_dashboard_tab_id",sql:"ALTER TABLE project_state ADD COLUMN active_dashboard_tab_id TEXT"},{table:"projects",column:"git_repo_path",sql:"ALTER TABLE projects ADD COLUMN git_repo_path TEXT"},{table:"connections",column:"is_local_only",sql:"ALTER TABLE connections ADD COLUMN is_local_only INTEGER NOT NULL DEFAULT 0"},{table:"connections",column:"shared_connection_id",sql:"ALTER TABLE connections ADD COLUMN shared_connection_id TEXT"},{table:"saved_queries",column:"starred",sql:"ALTER TABLE saved_queries ADD COLUMN starred INTEGER NOT NULL DEFAULT 0"},{table:"project_state",column:"starred_shared_query_ids",sql:"ALTER TABLE project_state ADD COLUMN starred_shared_query_ids TEXT NOT NULL DEFAULT '[]'"},{table:"project_state",column:"starred_shared_dashboard_ids",sql:"ALTER TABLE project_state ADD COLUMN starred_shared_dashboard_ids TEXT NOT NULL DEFAULT '[]'"},{table:"dashboards",column:"starred",sql:"ALTER TABLE dashboards ADD COLUMN starred INTEGER DEFAULT 0"},{table:"connections",column:"ai_share_schema",sql:"ALTER TABLE connections ADD COLUMN ai_share_schema INTEGER"},{table:"connections",column:"ai_share_data",sql:"ALTER TABLE connections ADD COLUMN ai_share_data INTEGER"},{table:"connections",column:"active_ai_provider_id",sql:"ALTER TABLE connections ADD COLUMN active_ai_provider_id TEXT"},{table:"connections",column:"active_ai_model",sql:"ALTER TABLE connections ADD COLUMN active_ai_model TEXT"},{table:"project_state",column:"pane_layout",sql:"ALTER TABLE project_state ADD COLUMN pane_layout TEXT"},{table:"dashboards",column:"shared",sql:"ALTER TABLE dashboards ADD COLUMN shared INTEGER NOT NULL DEFAULT 0"},{table:"dashboards",column:"description",sql:"ALTER TABLE dashboards ADD COLUMN description TEXT"},{table:"saved_queries",column:"shared",sql:"ALTER TABLE saved_queries ADD COLUMN shared INTEGER NOT NULL DEFAULT 0"},{table:"saved_queries",column:"description",sql:"ALTER TABLE saved_queries ADD COLUMN description TEXT"},{table:"saved_queries",column:"database_type",sql:"ALTER TABLE saved_queries ADD COLUMN database_type TEXT"},{table:"saved_queries",column:"tags",sql:"ALTER TABLE saved_queries ADD COLUMN tags TEXT"},{table:"saved_queries",column:"folder",sql:"ALTER TABLE saved_queries ADD COLUMN folder TEXT"}];for(const r of e)(await a.query(`PRAGMA table_info(${r.table})`)).some(_=>_.name===r.column)||await a.execute(r.sql);const s=await a.query("PRAGMA table_info(saved_queries)");s.some(r=>r.name==="connection_id")&&!s.some(r=>r.name==="project_id")&&(await a.execute("ALTER TABLE saved_queries ADD COLUMN project_id TEXT"),await a.execute(`UPDATE saved_queries SET project_id = (
        SELECT project_id FROM connections WHERE connections.id = saved_queries.connection_id
      ) WHERE project_id IS NULL`),await a.execute("DELETE FROM saved_queries WHERE project_id IS NULL")),s.some(r=>r.name==="connection_id")&&(await a.execute("DROP INDEX IF EXISTS idx_saved_queries_connection"),await a.execute("ALTER TABLE saved_queries DROP COLUMN connection_id"));const t=await a.query("PRAGMA table_info(dashboards)");t.some(r=>r.name==="connection_id")&&!t.some(r=>r.name==="project_id")&&(await a.execute("ALTER TABLE dashboards ADD COLUMN project_id TEXT"),await a.execute(`UPDATE dashboards SET project_id = (
        SELECT project_id FROM connections WHERE connections.id = dashboards.connection_id
      ) WHERE project_id IS NULL`),await a.execute("DELETE FROM dashboards WHERE project_id IS NULL")),t.some(r=>r.name==="connection_id")&&(await a.execute("DROP INDEX IF EXISTS idx_dashboards_connection"),await a.execute("ALTER TABLE dashboards DROP COLUMN connection_id"));const o=await a.query("PRAGMA table_info(project_state)");o.some(r=>r.name==="active_canvas_tab_id")&&!o.some(r=>r.name==="active_workflow_tab_id")&&await a.execute("ALTER TABLE project_state RENAME COLUMN active_canvas_tab_id TO active_workflow_tab_id"),await a.execute("UPDATE project_state SET active_view = 'workflow' WHERE active_view = 'canvas'");for(const r of O)await a.execute(r)}let L=null,u=null;async function b(){return L||u||(u=(async()=>{let a;if(S()){const{getDataDir:s}=await E(async()=>{const{getDataDir:c}=await import("./Bjg-aFyn.js");return{getDataDir:c}},__vite__mapDeps([0,1,2]),import.meta.url),{TauriSqliteProvider:t}=await E(async()=>{const{TauriSqliteProvider:c}=await import("./BHQ_a87B.js");return{TauriSqliteProvider:c}},__vite__mapDeps([3,1]),import.meta.url),o=new t,r=await s();a=await o.open(`${r}/seaquel.db`)}else{const{WebSqliteProvider:s}=await E(async()=>{const{WebSqliteProvider:o}=await import("./Ay-7V1Px.js");return{WebSqliteProvider:o}},__vite__mapDeps([4,5]),import.meta.url);a=await new s().open("seaquel.db")}if(await a.execute("PRAGMA journal_mode=WAL"),await a.execute("PRAGMA foreign_keys=ON"),await w(a)){const{migrateJsonToSqlite:s}=await E(async()=>{const{migrateJsonToSqlite:t}=await import("./B1O-cZRg.js");return{migrateJsonToSqlite:t}},__vite__mapDeps([6,5,7,8,9,10,11]),import.meta.url);await s(a),await a.execute("INSERT INTO schema_version (version) VALUES (?)",[I])}else if((await a.query("SELECT COUNT(*) as count FROM connections"))[0].count===0){const{migrateJsonToSqlite:t}=await E(async()=>{const{migrateJsonToSqlite:o}=await import("./B1O-cZRg.js");return{migrateJsonToSqlite:o}},__vite__mapDeps([6,5,7,8,9,10,11]),import.meta.url);await t(a)}return L=a,a})(),u)}const J=Object.freeze(Object.defineProperty({__proto__:null,getDatabase:b},Symbol.toStringTag,{value:"Module"}));function d(a,e){if(!a)return e;try{return JSON.parse(a)}catch{return e}}const U={async loadAll(a){const e=await a.query("SELECT id, name, description, created_at, updated_at, git_repo_path FROM projects"),s=[];for(const t of e){const o=await a.query("SELECT id, name, is_predefined, color FROM project_labels WHERE project_id = ?",[t.id]);s.push({id:t.id,name:t.name,description:t.description??void 0,createdAt:t.created_at,updatedAt:t.updated_at,gitRepoPath:t.git_repo_path??void 0,customLabels:o.map(r=>({id:r.id,name:r.name,isPredefined:r.is_predefined===1,color:r.color}))})}return s},async save(a,e){await a.execute(`INSERT INTO projects (id, name, description, created_at, updated_at, git_repo_path)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         name = excluded.name,
         description = excluded.description,
         updated_at = excluded.updated_at,
         git_repo_path = excluded.git_repo_path`,[e.id,e.name,e.description??null,e.createdAt,e.updatedAt,e.gitRepoPath??null]),await a.execute("DELETE FROM project_labels WHERE project_id = ?",[e.id]);for(const s of e.customLabels)await a.execute(`INSERT INTO project_labels (id, project_id, name, is_predefined, color)
         VALUES (?, ?, ?, ?, ?)`,[s.id,e.id,s.name,s.isPredefined?1:0,s.color])},async saveAll(a,e){for(const s of e)await this.save(a,s)},async remove(a,e){await a.execute("DELETE FROM projects WHERE id = ?",[e])}},N={async get(a,e){const s=await a.query("SELECT value FROM app_state WHERE key = ?",[e]);return s.length===0?null:s[0].value},async set(a,e,s){await a.execute("INSERT OR REPLACE INTO app_state (key, value) VALUES (?, ?)",[e,s])}},C={async loadAll(a){const e=await a.query("SELECT * FROM connections"),s=[];for(const t of e){const o=await a.query("SELECT label_id FROM connection_labels WHERE connection_id = ?",[t.id]);s.push({id:t.id,projectId:t.project_id,name:t.name,type:t.type,host:t.host,port:t.port,databaseName:t.database_name,username:t.username,sslMode:t.ssl_mode??void 0,connectionString:t.connection_string??void 0,lastConnected:t.last_connected?new Date(t.last_connected):void 0,sshTunnel:d(t.ssh_tunnel,void 0),savePassword:t.save_password===1,saveSshPassword:t.save_ssh_password===1,saveSshKeyPassphrase:t.save_ssh_key_passphrase===1,labelIds:o.map(r=>r.label_id),isLocalOnly:t.is_local_only===1?!0:void 0,sharedConnectionId:t.shared_connection_id??void 0,aiShareSchema:t.ai_share_schema===null||t.ai_share_schema===void 0?void 0:!!t.ai_share_schema,aiShareData:t.ai_share_data===null||t.ai_share_data===void 0?void 0:!!t.ai_share_data,activeAIProviderId:t.active_ai_provider_id??void 0,activeAIModel:t.active_ai_model??void 0})}return s},async save(a,e){await a.execute(`INSERT INTO connections
       (id, project_id, name, type, host, port, database_name, username, ssl_mode,
        connection_string, last_connected, ssh_tunnel, save_password, save_ssh_password,
        save_ssh_key_passphrase, is_local_only, shared_connection_id, ai_share_schema, ai_share_data,
        active_ai_provider_id, active_ai_model)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
         save_ssh_key_passphrase = excluded.save_ssh_key_passphrase,
         is_local_only = excluded.is_local_only,
         shared_connection_id = excluded.shared_connection_id,
         ai_share_schema = excluded.ai_share_schema,
         ai_share_data = excluded.ai_share_data,
         active_ai_provider_id = excluded.active_ai_provider_id,
         active_ai_model = excluded.active_ai_model`,[e.id,e.projectId,e.name,e.type,e.host,e.port,e.databaseName,e.username,e.sslMode??null,e.connectionString??null,e.lastConnected instanceof Date?e.lastConnected.toISOString():e.lastConnected??null,e.sshTunnel?JSON.stringify(e.sshTunnel):null,e.savePassword?1:0,e.saveSshPassword?1:0,e.saveSshKeyPassphrase?1:0,e.isLocalOnly?1:0,e.sharedConnectionId??null,e.aiShareSchema===void 0?null:e.aiShareSchema?1:0,e.aiShareData===void 0?null:e.aiShareData?1:0,e.activeAIProviderId??null,e.activeAIModel??null]),await a.execute("DELETE FROM connection_labels WHERE connection_id = ?",[e.id]);for(const s of e.labelIds)await a.execute("INSERT INTO connection_labels (connection_id, label_id) VALUES (?, ?)",[e.id,s])},async remove(a,e){await a.execute("DELETE FROM connections WHERE id = ?",[e])}},f={async load(a,e){const s=await a.query("SELECT * FROM project_state WHERE project_id = ?",[e]);if(s.length===0)return null;const t=s[0],o=await a.query("SELECT * FROM tabs WHERE project_id = ?",[e]),r=o.filter(i=>i.tab_type==="query").map(i=>({id:i.id,name:i.name,query:i.query??"",queryId:i.saved_query_id??i.shared_query_id??void 0})),c=o.filter(i=>i.tab_type==="schema").map(i=>({id:i.id,tableName:i.table_name??"",schemaName:i.schema_name??""})),_=o.filter(i=>i.tab_type==="explain").map(i=>({id:i.id,name:i.name,sourceQuery:i.source_query??""})),T=o.filter(i=>i.tab_type==="erd").map(i=>({id:i.id,name:i.name,connectionId:i.connection_id??void 0})),l=o.filter(i=>i.tab_type==="statistics").map(i=>({id:i.id,name:i.name,connectionId:i.connection_id??""})),n=o.filter(i=>i.tab_type==="canvas").map(i=>({id:i.id,name:i.name,connectionId:i.connection_id??""})),p=o.filter(i=>i.tab_type==="starter").map(i=>({id:i.id,type:i.starter_type??"getting-started",name:i.name,closable:i.closable===1})),A=o.filter(i=>i.tab_type==="dashboard").map(i=>({id:i.id,name:i.name,dashboardId:i.source_query??""})),y=(await a.query("SELECT id, data FROM saved_canvases WHERE project_id = ?",[e])).map(i=>d(i.data,null)).filter(i=>i!==null);let R=null;try{const i=await a.query("SELECT active_dashboard_tab_id FROM project_state WHERE project_id = ?",[e]);i.length>0&&(R=i[0].active_dashboard_tab_id)}catch{}let h=[];try{const i=await a.query("SELECT starred_shared_query_ids FROM project_state WHERE project_id = ?",[e]);i.length>0&&(h=d(i[0].starred_shared_query_ids,[]))}catch{}let v=[];try{const i=await a.query("SELECT starred_shared_dashboard_ids FROM project_state WHERE project_id = ?",[e]);i.length>0&&(v=d(i[0].starred_shared_dashboard_ids,[]))}catch{}let m;try{const i=await a.query("SELECT pane_layout FROM project_state WHERE project_id = ?",[e]);i.length>0&&i[0].pane_layout&&(m=d(i[0].pane_layout,void 0))}catch{}return{projectId:e,queryTabs:r,schemaTabs:c,explainTabs:_,erdTabs:T,statisticsTabs:l,workflowTabs:n,tabOrder:d(t.tab_order,[]),activeQueryTabId:t.active_query_tab_id,activeSchemaTabId:t.active_schema_tab_id,activeExplainTabId:t.active_explain_tab_id,activeErdTabId:t.active_erd_tab_id,activeStatisticsTabId:t.active_statistics_tab_id,activeWorkflowTabId:t.active_workflow_tab_id,activeView:t.active_view,activeConnectionId:t.active_connection_id,starterTabs:p,activeStarterTabId:t.active_starter_tab_id,savedWorkflows:y,dashboardTabs:A,activeDashboardTabId:R,starredSharedQueryIds:h,starredSharedDashboardIds:v,paneLayout:m}},async save(a,e){await a.execute(`INSERT OR REPLACE INTO project_state
       (project_id, active_view, active_connection_id, active_query_tab_id, active_schema_tab_id,
        active_explain_tab_id, active_erd_tab_id, active_statistics_tab_id, active_workflow_tab_id,
        active_visualize_tab_id, active_starter_tab_id, tab_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,[e.projectId,e.activeView,e.activeConnectionId,e.activeQueryTabId,e.activeSchemaTabId,e.activeExplainTabId,e.activeErdTabId,e.activeStatisticsTabId??null,e.activeWorkflowTabId??null,null,e.activeStarterTabId??null,JSON.stringify(e.tabOrder)]);try{await a.execute("UPDATE project_state SET active_dashboard_tab_id = ? WHERE project_id = ?",[e.activeDashboardTabId??null,e.projectId])}catch{}try{await a.execute("UPDATE project_state SET starred_shared_query_ids = ? WHERE project_id = ?",[JSON.stringify(e.starredSharedQueryIds??[]),e.projectId])}catch{}try{await a.execute("UPDATE project_state SET starred_shared_dashboard_ids = ? WHERE project_id = ?",[JSON.stringify(e.starredSharedDashboardIds??[]),e.projectId])}catch{}try{await a.execute("UPDATE project_state SET pane_layout = ? WHERE project_id = ?",[e.paneLayout?JSON.stringify(e.paneLayout):null,e.projectId])}catch{}await a.execute("DELETE FROM tabs WHERE project_id = ?",[e.projectId]);for(const s of e.queryTabs)await a.execute(`INSERT INTO tabs (id, project_id, tab_type, name, query, saved_query_id)
         VALUES (?, ?, 'query', ?, ?, ?)`,[s.id,e.projectId,s.name,s.query,s.queryId??null]);for(const s of e.schemaTabs)await a.execute(`INSERT INTO tabs (id, project_id, tab_type, name, table_name, schema_name)
         VALUES (?, ?, 'schema', ?, ?, ?)`,[s.id,e.projectId,s.tableName,s.tableName,s.schemaName]);for(const s of e.explainTabs)await a.execute(`INSERT INTO tabs (id, project_id, tab_type, name, source_query)
         VALUES (?, ?, 'explain', ?, ?)`,[s.id,e.projectId,s.name,s.sourceQuery]);for(const s of e.erdTabs)await a.execute(`INSERT INTO tabs (id, project_id, tab_type, name, connection_id)
         VALUES (?, ?, 'erd', ?, ?)`,[s.id,e.projectId,s.name,s.connectionId??null]);for(const s of e.statisticsTabs??[])await a.execute(`INSERT INTO tabs (id, project_id, tab_type, name, connection_id)
         VALUES (?, ?, 'statistics', ?, ?)`,[s.id,e.projectId,s.name,s.connectionId]);for(const s of e.workflowTabs??[])await a.execute(`INSERT INTO tabs (id, project_id, tab_type, name, connection_id)
         VALUES (?, ?, 'canvas', ?, ?)`,[s.id,e.projectId,s.name,s.connectionId]);for(const s of e.starterTabs??[])await a.execute(`INSERT INTO tabs (id, project_id, tab_type, name, starter_type, closable)
         VALUES (?, ?, 'starter', ?, ?, ?)`,[s.id,e.projectId,s.name,s.type,s.closable?1:0]);for(const s of e.dashboardTabs??[])await a.execute(`INSERT INTO tabs (id, project_id, tab_type, name, source_query)
         VALUES (?, ?, 'dashboard', ?, ?)`,[s.id,e.projectId,s.name,s.dashboardId]);await a.execute("DELETE FROM saved_canvases WHERE project_id = ?",[e.projectId]);for(const s of e.savedWorkflows??[])await a.execute("INSERT INTO saved_canvases (id, project_id, data) VALUES (?, ?, ?)",[s.id??`workflow-${crypto.randomUUID()}`,e.projectId,JSON.stringify(s)])},async remove(a,e){await a.execute("DELETE FROM project_state WHERE project_id = ?",[e]),await a.execute("DELETE FROM tabs WHERE project_id = ?",[e]),await a.execute("DELETE FROM saved_canvases WHERE project_id = ?",[e])}},q={async loadByProject(a,e){return(await a.query("SELECT * FROM saved_queries WHERE project_id = ?",[e])).map(t=>({id:t.id,projectId:t.project_id,name:t.name,query:t.query,parameters:d(t.parameters,void 0),starred:!!t.starred,shared:!!t.shared,description:t.description??void 0,databaseType:t.database_type??void 0,tags:d(t.tags,void 0),folder:t.folder??void 0,createdAt:t.created_at,updatedAt:t.updated_at}))},async saveAll(a,e,s){const t=s.map(o=>o.id);if(t.length>0){const o=t.map(()=>"?").join(",");await a.execute(`DELETE FROM saved_queries WHERE project_id = ? AND id NOT IN (${o})`,[e,...t])}else await a.execute("DELETE FROM saved_queries WHERE project_id = ?",[e]);for(const o of s)await a.execute(`INSERT INTO saved_queries (id, project_id, name, query, parameters, starred, shared, description, database_type, tags, folder, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           name = excluded.name,
           query = excluded.query,
           parameters = excluded.parameters,
           starred = excluded.starred,
           shared = excluded.shared,
           description = excluded.description,
           database_type = excluded.database_type,
           tags = excluded.tags,
           folder = excluded.folder,
           updated_at = excluded.updated_at`,[o.id,e,o.name,o.query,o.parameters?JSON.stringify(o.parameters):null,o.starred?1:0,o.shared?1:0,o.description??null,o.databaseType??null,o.tags?JSON.stringify(o.tags):null,o.folder??null,o.createdAt,o.updatedAt])},async removeByProject(a,e){await a.execute("DELETE FROM saved_queries WHERE project_id = ?",[e])}},X={async loadByQuery(a,e){return(await a.query("SELECT * FROM query_versions WHERE saved_query_id = ? ORDER BY version ASC",[e])).map(t=>({id:t.id,queryId:t.saved_query_id,version:t.version,snapshot:t.snapshot,diff:t.diff,createdAt:t.created_at}))},async loadByProject(a,e){return(await a.query(`SELECT qv.* FROM query_versions qv
       JOIN saved_queries sq ON sq.id = qv.saved_query_id
       WHERE sq.project_id = ?
       ORDER BY qv.saved_query_id, qv.version ASC`,[e])).map(t=>({id:t.id,queryId:t.saved_query_id,version:t.version,snapshot:t.snapshot,diff:t.diff,createdAt:t.created_at}))},async insert(a,e){await a.execute(`INSERT INTO query_versions (id, saved_query_id, version, snapshot, diff, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,[e.id,e.queryId,e.version,e.snapshot,e.diff,e.createdAt])},async pruneOldVersions(a,e,s){const t=await this.loadByQuery(a,e);if(t.length<=s)return;const o=[...t].sort((n,p)=>p.version-n.version),r=o[s-1]?.version;if(r===void 0)return;const{resolveVersions:c}=await E(async()=>{const{resolveVersions:n}=await import("./Db73Mrdx.js");return{resolveVersions:n}},__vite__mapDeps([12,13]),import.meta.url),_=c(t.map(n=>({...n,createdAt:new Date(n.createdAt)}))),T=o[s-1],l=_.find(n=>n.id===T.id);await a.execute(`DELETE FROM query_versions
       WHERE saved_query_id = ?
         AND version < ?`,[e,r]),T.snapshot===null&&l&&await a.execute("UPDATE query_versions SET snapshot = ?, diff = NULL WHERE id = ?",[l.query,T.id])}},x={async loadByConnection(a,e){return(await a.query("SELECT * FROM query_history WHERE connection_id = ? ORDER BY timestamp DESC",[e])).map(t=>({id:t.id,connectionId:t.connection_id,query:t.query,timestamp:t.timestamp,executionTime:t.execution_time,rowCount:t.row_count,favorite:t.favorite===1,connectionLabelsSnapshot:d(t.connection_labels_snapshot,[]),connectionNameSnapshot:t.connection_name_snapshot}))},async replaceAll(a,e,s){await a.execute("DELETE FROM query_history WHERE connection_id = ?",[e]);for(const t of s)await a.execute(`INSERT INTO query_history
         (id, connection_id, query, timestamp, execution_time, row_count, favorite,
          connection_labels_snapshot, connection_name_snapshot)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,[t.id,e,t.query,t.timestamp,t.executionTime,t.rowCount,t.favorite?1:0,t.connectionLabelsSnapshot?JSON.stringify(t.connectionLabelsSnapshot):null,t.connectionNameSnapshot])},async removeByConnection(a,e){await a.execute("DELETE FROM query_history WHERE connection_id = ?",[e])}},F={async loadAll(a){const s=(await a.query("SELECT id, data FROM shared_repos")).map(o=>d(o.data,null)).filter(o=>o!==null),t=await N.get(a,"activeRepoId");return{repos:s,activeRepoId:t}},async saveAll(a,e,s){await a.execute("DELETE FROM shared_repos");for(const t of e)await a.execute("INSERT INTO shared_repos (id, data) VALUES (?, ?)",[t.id,JSON.stringify(t)]);await N.set(a,"activeRepoId",s)}},j={async loadPreferences(a){const e=await a.query("SELECT light_theme_id, dark_theme_id FROM theme_preferences WHERE id = 1");return e.length===0?null:{lightThemeId:e[0].light_theme_id,darkThemeId:e[0].dark_theme_id}},async savePreferences(a,e,s){await a.execute(`INSERT OR REPLACE INTO theme_preferences (id, light_theme_id, dark_theme_id)
       VALUES (1, ?, ?)`,[e,s])},async loadUserThemes(a){return(await a.query("SELECT id, data FROM user_themes")).map(s=>d(s.data,null)).filter(s=>s!==null)},async saveUserThemes(a,e){await a.execute("DELETE FROM user_themes");for(const s of e){const t=s;await a.execute("INSERT INTO user_themes (id, data) VALUES (?, ?)",[t.id,JSON.stringify(s)])}}},M={async load(a){const e=await a.query("SELECT data FROM license_state WHERE id = 1");return e.length===0?null:d(e[0].data,null)},async save(a,e){await a.execute("INSERT OR REPLACE INTO license_state (id, data) VALUES (1, ?)",[JSON.stringify(e)])}},g={async load(a){const e=await a.query("SELECT data FROM onboarding_state WHERE id = 1");return e.length===0?null:d(e[0].data,null)},async save(a,e){await a.execute("INSERT OR REPLACE INTO onboarding_state (id, data) VALUES (1, ?)",[JSON.stringify(e)])}},P={async loadAll(a){return a.query("SELECT lesson_id as lessonId, challenge_id as challengeId, state FROM tutorial_progress")},async save(a,e,s,t){await a.execute(`INSERT OR REPLACE INTO tutorial_progress (lesson_id, challenge_id, state)
       VALUES (?, ?, ?)`,[e,s,t])},async removeLesson(a,e){await a.execute("DELETE FROM tutorial_progress WHERE lesson_id = ?",[e])},async removeAll(a){await a.execute("DELETE FROM tutorial_progress")}},B={async loadByProject(a,e){return(await a.query("SELECT * FROM dashboards WHERE project_id = ?",[e])).map(t=>({id:t.id,projectId:t.project_id,name:t.name,viewport:t.viewport,widgets:t.widgets,dateFilter:t.date_filter,starred:(t.starred??0)===1,shared:!!t.shared,description:t.description??void 0,createdAt:t.created_at,updatedAt:t.updated_at}))},async save(a,e){await a.execute(`INSERT INTO dashboards (id, project_id, name, viewport, widgets, date_filter, starred, shared, description, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         name = excluded.name,
         viewport = excluded.viewport,
         widgets = excluded.widgets,
         date_filter = excluded.date_filter,
         starred = excluded.starred,
         shared = excluded.shared,
         description = excluded.description,
         updated_at = excluded.updated_at`,[e.id,e.projectId,e.name,e.viewport,e.widgets,e.dateFilter??null,e.starred?1:0,e.shared?1:0,e.description??null,e.createdAt,e.updatedAt])},async remove(a,e){await a.execute("DELETE FROM dashboards WHERE id = ?",[e])},async removeByProject(a,e){await a.execute("DELETE FROM dashboards WHERE project_id = ?",[e])}},W={async loadByDashboard(a,e){return(await a.query("SELECT * FROM dashboard_versions WHERE dashboard_id = ? ORDER BY version ASC",[e])).map(t=>({id:t.id,dashboardId:t.dashboard_id,version:t.version,snapshot:t.snapshot,createdAt:t.created_at}))},async loadByProject(a,e){return(await a.query(`SELECT dv.* FROM dashboard_versions dv
       JOIN dashboards d ON d.id = dv.dashboard_id
       WHERE d.project_id = ?
       ORDER BY dv.dashboard_id, dv.version ASC`,[e])).map(t=>({id:t.id,dashboardId:t.dashboard_id,version:t.version,snapshot:t.snapshot,createdAt:t.created_at}))},async insert(a,e){await a.execute(`INSERT INTO dashboard_versions (id, dashboard_id, version, snapshot, created_at)
       VALUES (?, ?, ?, ?, ?)`,[e.id,e.dashboardId,e.version,e.snapshot,e.createdAt])},async pruneOldVersions(a,e,s){await a.execute(`DELETE FROM dashboard_versions
       WHERE dashboard_id = ?
         AND version <= (
           SELECT version FROM dashboard_versions
           WHERE dashboard_id = ?
           ORDER BY version DESC
           LIMIT 1 OFFSET ?
         )`,[e,e,s])}},H={async load(a,e){const s=await a.query("SELECT * FROM connection_overrides WHERE shared_connection_id = ?",[e]);if(s.length===0)return null;const t=s[0];return{sharedConnectionId:t.shared_connection_id,username:t.username??void 0,hostOverride:t.host_override??void 0,portOverride:t.port_override??void 0,savePassword:t.save_password===1,saveSshPassword:t.save_ssh_password===1,saveSshKeyPassphrase:t.save_ssh_key_passphrase===1}},async loadAll(a){return(await a.query("SELECT * FROM connection_overrides")).map(s=>({sharedConnectionId:s.shared_connection_id,username:s.username??void 0,hostOverride:s.host_override??void 0,portOverride:s.port_override??void 0,savePassword:s.save_password===1,saveSshPassword:s.save_ssh_password===1,saveSshKeyPassphrase:s.save_ssh_key_passphrase===1}))},async save(a,e){await a.execute(`INSERT INTO connection_overrides
       (shared_connection_id, username, host_override, port_override,
        save_password, save_ssh_password, save_ssh_key_passphrase)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(shared_connection_id) DO UPDATE SET
         username = excluded.username,
         host_override = excluded.host_override,
         port_override = excluded.port_override,
         save_password = excluded.save_password,
         save_ssh_password = excluded.save_ssh_password,
         save_ssh_key_passphrase = excluded.save_ssh_key_passphrase`,[e.sharedConnectionId,e.username??null,e.hostOverride??null,e.portOverride??null,e.savePassword?1:0,e.saveSshPassword?1:0,e.saveSshKeyPassphrase?1:0])},async remove(a,e){await a.execute("DELETE FROM connection_overrides WHERE shared_connection_id = ?",[e])}},Y={async load(a,e){const s=await a.query("SELECT has_offered_import, last_check_timestamp FROM import_state WHERE source = ?",[e]);return s.length===0?null:{hasOfferedImport:s[0].has_offered_import===1,lastCheckTimestamp:s[0].last_check_timestamp}},async save(a,e,s,t){await a.execute(`INSERT OR REPLACE INTO import_state (source, has_offered_import, last_check_timestamp)
       VALUES (?, ?, ?)`,[e,s?1:0,t])}},V={async loadByConnection(a,e){return(await a.query("SELECT * FROM ai_chats WHERE connection_id = ? ORDER BY updated_at DESC",[e])).map(t=>({id:t.id,connectionId:t.connection_id,title:t.title,createdAt:t.created_at,updatedAt:t.updated_at}))},async saveChat(a,e){await a.execute(`INSERT INTO ai_chats (id, connection_id, title, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         title = excluded.title,
         updated_at = excluded.updated_at`,[e.id,e.connectionId,e.title,e.createdAt,e.updatedAt])},async removeChat(a,e){await a.execute("DELETE FROM ai_chats WHERE id = ?",[e])},async removeByConnection(a,e){await a.execute("DELETE FROM ai_chats WHERE connection_id = ?",[e])},async loadMessages(a,e){return(await a.query("SELECT * FROM ai_messages WHERE chat_id = ? ORDER BY timestamp ASC",[e])).map(t=>({id:t.id,chatId:t.chat_id,role:t.role,content:t.content,timestamp:t.timestamp,query:t.query??void 0}))},async replaceAllMessages(a,e,s){await a.execute("DELETE FROM ai_messages WHERE chat_id = ?",[e]);for(const t of s)await a.execute(`INSERT INTO ai_messages (id, chat_id, role, content, timestamp, query)
         VALUES (?, ?, ?, ?, ?, ?)`,[t.id,e,t.role,t.content,t.timestamp,t.query??null])}},Q=Object.freeze(Object.defineProperty({__proto__:null,aiChatsRepo:V,appStateRepo:N,connectionOverridesRepo:H,connectionsRepo:C,dashboardVersionsRepo:W,dashboardsRepo:B,importStateRepo:Y,licenseRepo:M,onboardingRepo:g,projectStateRepo:f,projectsRepo:U,queryHistoryRepo:x,queryVersionsRepo:X,savedQueriesRepo:q,sharedReposRepo:F,themeRepo:j,tutorialRepo:P},Symbol.toStringTag,{value:"Module"}));export{I as C,N as a,f as b,C as c,F as d,P as e,X as f,b as g,W as h,Y as i,B as j,V as k,M as l,H as m,J as n,g as o,U as p,x as q,Q as r,q as s,j as t};
