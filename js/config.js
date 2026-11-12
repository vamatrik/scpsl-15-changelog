/* Section structure, map layout, jokes and UI strings. Entry numbers point into CL_ENTRIES (data.js). */
(function(){
const S=(id,cat,ru,en,ranges)=>({id,cat,t:{ru,en},ranges});
window.CL_SECTIONS=[
 S('gameplay','gameplay','Геймплей','Gameplay',[[4,22]]),
 S('allscps','scp','Все SCP','All SCPs',[[23,42]]),
 S('scp953','scp','SCP-953 — новая аномалия','SCP-953 — new anomaly',[[43,57]]),
 S('scp079','scp','SCP-079','SCP-079',[[58,84]]),
 S('scp096','scp','SCP-096','SCP-096',[[85,92]]),
 S('scp106','scp','SCP-106','SCP-106',[[93,105]]),
 S('scp049','scp','SCP-049','SCP-049',[[106,109]]),
 S('scp0492','scp','SCP-049-2','SCP-049-2',[[110,113]]),
 S('scp173','scp','SCP-173','SCP-173',[[114,114]]),
 S('scp939','scp','SCP-939','SCP-939',[[115,133]]),
 S('items','items','Предметы и карты-ключи','Items & keycards',[[134,151]]),
 S('anti207','items','Anti-SCP-207','Anti-SCP-207',[[152,163]]),
 S('scp1344','items','SCP-1344','SCP-1344',[[164,168]]),
 S('weapons','weapons','Оружие: общее и прицелы','Weapons: general & scopes',[[169,187]]),
 S('clutter','weapons','Оружейный «мусор»','Firearm clutter',[[188,198]]),
 S('shotgun','weapons','Дробовик','Shotgun',[[199,213]]),
 S('ak','weapons','AK','AK',[[214,216]]),
 S('fsp9','weapons','FSP-9','FSP-9',[[217,217]]),
 S('revolver','weapons','Револьвер','Revolver',[[218,220]]),
 S('e11','weapons','E11-SR','E11-SR',[[221,221]]),
 S('crossvec','weapons','Crossvec','Crossvec',[[222,223]]),
 S('scp127','weapons','SCP-127','SCP-127',[[224,226]]),
 S('scp1509','weapons','SCP-1509','SCP-1509',[[227,231]]),
 S('microhid','weapons','Micro-HID','Micro-HID',[[232,236]]),
 S('jailbird','weapons','Jailbird','Jailbird',[[237,237]]),
 S('disruptor','weapons','Дисраптор частиц','Particle Disruptor',[[238,241]]),
 S('mainmenu','ui','Главное меню','Main Menu',[[242,244]]),
 S('news','ui','Новости','News',[[245,253]]),
 S('esc','ui','Меню ESC','ESC Menu',[[254,254]]),
 S('abilityhud','ui','HUD способностей SCP','SCP Ability HUD',[[255,259]]),
 S('dialogs','ui','Диалоги и подсказки','Dialogs & hints',[[260,267]]),
 S('mapgen','map','Карта: общее','Map: general',[[268,270]]),
 S('surf-overview','map','Поверхность: новый облик','Surface: overhaul',[[271,277]]),
 S('surf-cassie','map','Поверхность: секция C.A.S.S.I.E.','Surface: CASSIE section',[[278,280]]),
 S('surf-garage','map','Поверхность: гаражные ворота','Surface: garage doors',[[281,285]]),
 S('surf-generator','map','Поверхность: резервный генератор','Surface: backup generator',[[286,292]]),
 S('surf-metal','map','Поверхность: металлодетекторы','Surface: metal detectors',[[293,294]]),
 S('surf-sky','map','Поверхность: небо','Surface: skybox',[[295,295]]),
 S('surf-doors','map','Поверхность: двери и боеголовка','Surface: doors & warhead',[[296,298]]),
 S('surf-wire','map','Поверхность: колючая проволока','Surface: barbed wire',[[299,305]]),
 S('lcz-914','map','Лёгкая зона: SCP-914','LCZ: SCP-914',[[306,311]]),
 S('lcz-pt00','map','Лёгкая зона: PT-00','LCZ: PT-00',[[312,317]]),
 S('lcz-vt01','map','Лёгкая зона: VT-01','LCZ: VT-01',[[319,322]]),
 S('lcz-elevc','map','Лёгкая зона: Лифт C','LCZ: Elevator C',[[323,325]]),
 S('lcz-layouts','map','Лёгкая зона: раскладки и комнаты','LCZ: layouts & rooms',[[318,318],[326,328]]),
 S('ez-gates','map','Офисная зона: Ворота А и Б','EZ: Gate A & Gate B',[[329,333]]),
 S('ez-layouts','map','Офисная зона: раскладки','EZ: layouts',[[334,336]]),
 S('ez-glass','map','Офисная зона: стёкла','EZ: glass',[[337,338]]),
 S('hcz-gens','map','Тяжёлая зона: генераторы','HCZ: generators',[[339,339]]),
 S('hcz-deep','map','Тяжёлая зона: Глубокий угол','HCZ: Deep Corner',[[340,341]]),
 S('hcz-ramp','map','Тяжёлая зона: Перекрёсток с рампой','HCZ: Ramp Intersection',[[342,348]]),
 S('hcz-light','map','Тяжёлая зона: свет и декор','HCZ: lighting & props',[[349,353]]),
 S('hcz-079armory','map','Тяжёлая зона: оружейная 079','HCZ: 079 armory',[[354,357]]),
 S('hcz-049sub','map','Тяжёлая зона: подуровень 049','HCZ: 049 sublevel',[[358,358]]),
 S('hcz-warhead','map','Тяжёлая зона: панель боеголовки','HCZ: warhead panel',[[359,359]]),
 S('phones','phones','Рабочие телефоны','Usable phones',[[360,373]]),
 S('libs','tech','Библиотеки','Libraries',[[374,389]]),
 S('engine','tech','Система и движок','System & Engine',[[390,409]]),
 S('api','tech','Изменения API','API Changes',[[410,529]]),
 S('outlines','tech','Обводки (Outlines)','Outlines',[[530,544]]),
 S('displaykit','tech','DisplayKit','DisplayKit',[[545,546]]),
 S('primitives','tech','Primitive Toys','Primitive Toys',[[547,557]]),
 S('ra','tech','RemoteAdmin и конфиг сервера','RemoteAdmin & server config',[[558,565]]),
 S('fixes','fixes','Исправления','Fixes',[[566,637]])
];
window.CL_CATS=[
 {id:'gameplay',ru:'Геймплей',en:'Gameplay'},
 {id:'scp',ru:'Субъекты SCP',en:'SCP subjects'},
 {id:'items',ru:'Предметы',en:'Items'},
 {id:'weapons',ru:'Вооружение',en:'Weapons'},
 {id:'ui',ru:'Интерфейс',en:'Interface'},
 {id:'map',ru:'Карта комплекса',en:'Facility map'},
 {id:'phones',ru:'Телефоны',en:'Phones'},
 {id:'tech',ru:'Технический журнал',en:'Technical changelog'},
 {id:'fixes',ru:'Исправления',en:'Fixes'}
];
/* Zones: grid in world units. */
window.CL_ZONES=[
 {id:'surface',ru:'ПОВЕРХНОСТЬ',en:'SURFACE ZONE',short:'SZ',cols:16,rows:2,y:60,color:'#9cc9ff',seed:7},
 {id:'ez',ru:'ОФИСНАЯ ЗОНА',en:'ENTRANCE ZONE',short:'EZ',cols:16,rows:3,y:400,color:'#ffd27a',seed:11},
 {id:'hcz',ru:'ТЯЖЁЛАЯ ЗОНА СОДЕРЖАНИЯ',en:'HEAVY CONTAINMENT ZONE',short:'HCZ',cols:16,rows:4,y:850,color:'#ff7a5c',seed:23},
 {id:'lcz',ru:'ЛЁГКАЯ ЗОНА СОДЕРЖАНИЯ',en:'LIGHT CONTAINMENT ZONE',short:'LCZ',cols:16,rows:4,y:1420,color:'#9be29b',seed:5}
];
/* Hubs = clickable rooms on the map. face: meme face id. */
const H=(id,zone,c,r,icon,ru,en,secs,face,jru,jen)=>({id,zone,c,r,icon,t:{ru,en},secs,face,joke:{ru:jru,en:jen}});
window.CL_HUBS=[
 H('gate-a','surface',2,1,'gate','Ворота А','Gate A',['surf-metal'],'dboy',['ПРОХОДИШЬ МЕТАЛЛОДЕТЕКТОР','С ТРЕМЯ ЛОГИЧЕРАМИ В КАРМАНАХ'],['WALKING THROUGH THE METAL DETECTOR','WITH THREE LOGICERS IN YOUR POCKETS']),
 H('fence','surface',5,0,'wire','Ограждение','Perimeter fence',['surf-wire'],'dboy',['КОЛЮЧКА: −100% К ТОЧНОСТИ','ПОВСТАНЦЫ: У НАС И ТАК БЫЛО −100%'],['BARBED WIRE: −100% ACCURACY','CHAOS: WE WERE ALREADY AT −100%']),
 H('surface-yard','surface',8,0,'snow','Двор комплекса','Facility yard',['surf-overview','surf-sky','surf-garage','surf-doors'],'flamingo',['НА ПОВЕРХНОСТИ ТЕПЕРЬ ИДЁТ СНЕГ','УЧЁНЫЙ БЕЖИТ К ГОРАМ В ОДНОМ ХАЛАТЕ'],['IT SNOWS ON SURFACE NOW','SCIENTIST ESCAPING IN JUST A LAB COAT']),
 H('cassie','surface',11,1,'speaker','Секция C.A.S.S.I.E.','CASSIE section',['surf-cassie'],'speaker',['ДВЕРИ C.A.S.S.I.E. НЕЛЬЗЯ ЗАКРЫТЬ','КАК И МОЮ ВКЛАДКУ С ЧЕЙНДЖЛОГОМ'],['CASSIE DOORS CAN’T BE CLOSED','NEITHER CAN MY CHANGELOG TAB']),
 H('gate-b','surface',14,1,'gen','Ворота Б','Gate B',['surf-generator'],'crt',['079 ПОСЛЕ ВЗРЫВА БОЕГОЛОВКИ: Я ВЫЖИЛ','ГЕНЕРАТОР У ВОРОТ Б: ЭТО ПОКА'],['079 AFTER THE NUKE: I SURVIVED','GATE B GENERATOR: FOR NOW']),
 H('ez-gates','ez',8,0,'gate','Выходы к воротам','Gate exits',['ez-gates'],'crtsad',['НОВЫЕ ВОРОТА — В ГРЕЙБОКСЕ','ЗАТО ЧЕСТНО'],['THE NEW GATES ARE GRAYBOX','AT LEAST IT’S HONEST']),
 H('intercom','ez',4,1,'phone','Интерком и связь','Intercom & comms',['phones'],'phone',['ВСЕ ТЕЛЕФОНЫ КОМПЛЕКСА ЗВОНЯТ РАЗОМ','«ЗДРАВСТВУЙТЕ, ВАС БЕСПОКОИТ СЛУЖБА БЕЗОПАСНОСТИ ФОНДА»'],['EVERY PHONE IN THE FACILITY RINGS','“WE’VE BEEN TRYING TO REACH YOU ABOUT YOUR EXTENDED WARRANTY”']),
 H('signal-953','ez',12,1,'unknown','Неопознанный сигнал','Unidentified signal',['scp953'],'dboy',['В ОТРЯДЕ МОГ БЫЛО ПЯТЬ ЧЕЛОВЕК','ИЗ ВЕРТОЛЁТА ВЫШЛИ ШЕСТЬ'],['THE MTF SQUAD HAD FIVE PEOPLE','SIX GOT OFF THE HELICOPTER']),
 H('ui-room','ez',1,2,'monitor','Центр мониторинга','Monitoring center',['mainmenu','news','esc','abilityhud','dialogs'],'crt',['НОВОЕ ГЛАВНОЕ МЕНЮ','СМОТРЮ НА НЕГО ДОЛЬШЕ, ЧЕМ ЖИВУ В РАУНДЕ'],['THE NEW MAIN MENU','I STARE AT IT LONGER THAN I SURVIVE A ROUND']),
 H('ez-offices','ez',9,2,'glass','Офисы','Offices',['ez-layouts','ez-glass'],'crtsad',['ПРОЧНОСТЬ СТЕКЛА: 20 → 100','А СЕРДЦЕ ВСЁ РАВНО РАЗБИЛОСЬ'],['GLASS HP: 20 → 100','MY HEART STILL BROKE THOUGH']),
 H('ez-maint','ez',14,2,'wrench','Техобслуживание','Maintenance',['fixes'],'crt',['72 ИСПРАВЛЕНИЯ','И НИ ОДНОГО ПРО МОЙ ПИНГ'],['72 BUG FIXES','NONE OF THEM ABOUT MY PING']),
 H('c079','hcz',2,0,'camera','Камера SCP-079','SCP-079 chamber',['scp079','hcz-gens','hcz-079armory'],'crtsad',['079 НАЧИНАЕТ РАУНД С 0 AP','Я В ПОНЕДЕЛЬНИК УТРОМ'],['079 STARTS THE ROUND WITH 0 AP','ME ON A MONDAY MORNING']),
 H('silo','hcz',6,0,'nuke','Шахта боеголовки','Warhead silo',['hcz-warhead','hcz-light'],'speaker',['ПАНЕЛЬ БОЕГОЛОВКИ ОБНОВИЛИ','ЧТОБЫ ВЗРЫВАТЬ ВСЁ БЫЛО ЭСТЕТИЧНЕЕ'],['THE WARHEAD PANEL GOT A REDESIGN','BLOWING EVERYTHING UP, BUT AESTHETIC']),
 H('servers','hcz',12,0,'server','Серверная','Server room',['libs','engine','api','outlines','displaykit','primitives','ra'],'crt',['КОД ПЕРЕЕХАЛ ИЗ ASSEMBLY-CSHARP','ПЛАГИНОДЕЛЫ В 3 НОЧИ: *ПРАВЯТ .CSPROJ*'],['CODE MOVED OUT OF ASSEMBLY-CSHARP','PLUGIN DEVS AT 3 AM: *EDITING .CSPROJ*']),
 H('scp-common','hcz',8,1,'eye','Сеть SCP','SCP network',['allscps'],'flamingo',['ГОЛОВА SCP: 1,95 М. ЧЕЛОВЕКА: 1,8 М','ФЛАМИНГО: 1,2 М. ЗАЧЕМ ЭТО В ПАТЧНОУТЕ? НЕ ВАЖНО'],['SCP HEAD: 1.95 M. HUMAN: 1.8 M','FLAMINGO: 1.2 M. WHY IS THIS HERE? DOESN’T MATTER']),
 H('c096','hcz',4,2,'cry','Камера SCP-096','SCP-096 chamber',['scp096'],'crtsad',['У 096 ТЕПЕРЬ ТОЧНЫЙ ХИТБОКС','HP 3000 → 2500. ПЛАЧЕТ ЕЩЁ СИЛЬНЕЕ'],['096 GOT AN ACCURATE HITBOX','HP 3000 → 2500. NOW HE CRIES HARDER']),
 H('c106','hcz',10,2,'drip','Камера SCP-106','SCP-106 chamber',['scp106'],'dboy',['106 НЕЛЬЗЯ ОСЛЕПИТЬ ВО ВРЕМЯ ПРЕСЛЕДОВАНИЯ','Я С ФЛЕШКОЙ В РУКЕ: И ЧТО ТЕПЕРЬ?'],['106 CAN’T BE FLASHED WHILE STALKING','ME HOLDING A FLASHBANG: NOW WHAT?']),
 H('microhid','hcz',15,2,'bolt','Хранилище Micro-HID','Micro-HID storage',['microhid'],'dboy',['ЛУЧ MICRO-HID: 0,2 → 0,55 М','ПРОМАХНУТЬСЯ ТЕПЕРЬ — ЭТО ТАЛАНТ'],['MICRO-HID BEAM: 0.2 → 0.55 M','MISSING NOW TAKES TALENT']),
 H('c049','hcz',1,3,'mask','Камера SCP-049','SCP-049 chamber',['scp049','scp0492','hcz-049sub'],'crt',['ДОКТОР ВИДИТ ТВОЮ ОСТАНОВКУ СЕРДЦА','С 25 МЕТРОВ. НЕ СКВОЗЬ СТЕНЫ. НО ВСЁ РАВНО ЖУТКО'],['THE DOCTOR SEES YOUR CARDIAC ARREST','25 METERS. NOT THROUGH WALLS. STILL CREEPY']),
 H('c939','hcz',6,3,'wave','Камера SCP-939','SCP-939 chamber',['scp939'],'phone',['939 ТЕПЕРЬ УМЕЕТ В ТЕЛЕФОН И ИНТЕРКОМ','«МАМ, ЗАБЕРИ МЕНЯ С РАУНДА» — ТВОИМ ГОЛОСОМ'],['939 CAN NOW USE PHONES AND THE INTERCOM','“MOM, PICK ME UP” — IN YOUR VOICE']),
 H('c127','hcz',11,3,'gun','Камера SCP-127','SCP-127 chamber',['scp127'],'crtsad',['SCP-127: 60 → 50 ПАТРОНОВ','ДАЖЕ ЖИВОЙ ПИСТОЛЕТ ПОСАДИЛИ НА ДИЕТУ'],['SCP-127: 60 → 50 AMMO','EVEN THE LIVING GUN IS ON A DIET']),
 H('hcz-rooms','hcz',14,3,'stairs','Перекрёстки и углы','Intersections & corners',['hcz-deep','hcz-ramp','mapgen'],'dboy',['ПРОСТРЕЛ ЗАКРЫЛИ БРЕЗЕНТОМ','КЕМПЕРЫ НА РАМПЕ: ВЫ ЧТО НАДЕЛАЛИ'],['SIGHTLINE BLOCKED WITH A TARP','RAMP CAMPERS: WHAT HAVE YOU DONE']),
 H('c914','lcz',3,0,'gear','SCP-914','SCP-914',['lcz-914','anti207','scp1344'],'crtsad',['SCP-207 НА 1:1','50% АНТИ-КОЛА, 50% ПУСТОТА И ОБИДА'],['SCP-207 ON 1:1','50% ANTI-COLA, 50% EMOTIONAL DAMAGE']),
 H('pt00','lcz',12,0,'statue','PT-00 · SCP-173','PT-00 · SCP-173',['scp173','lcz-pt00'],'dboy',['КАРТА РУКОВОДИТЕЛЯ И SCP-500 НА СТОЛЕ','ЗА ДВЕРЬЮ, КОТОРУЮ ТЫ НЕ ОТКРОЕШЬ'],['SUPERVISOR CARD AND SCP-500 ON THE DESK','BEHIND A DOOR YOU CAN’T OPEN']),
 H('armory','lcz',8,1,'gun','Оружейная','Armory',['weapons','clutter','shotgun','ak','fsp9','revolver','e11','crossvec','scp1509','jailbird','disruptor'],'dboy',['ДРОБОВИК: 13 ДРОБИН, 91 УРОНА','КОРИДОРЫ ТЯЖЁЛОЙ ТЕПЕРЬ МОИ'],['SHOTGUN: 13 PELLETS, 91 DAMAGE','HCZ HALLWAYS ARE MINE NOW']),
 H('vt01','lcz',5,2,'plant','VT-01','VT-01',['lcz-vt01'],'flamingo',['VT-01: СТЕКЛО И РАСТЕНИЯ','САМАЯ УЮТНАЯ КОМНАТА, ЧТОБЫ УМЕРЕТЬ'],['VT-01: GLASS AND PLANTS','THE COZIEST ROOM TO DIE IN']),
 H('lockers','lcz',11,2,'card','Склад и шкафчики','Storage & lockers',['items'],'crtsad',['ЛИМИТ SCP-ПРЕДМЕТОВ: 3 → 2','БАРАХОЛЬЩИКИ В ТРАУРЕ'],['SCP ITEM LIMIT: 3 → 2','HOARDERS IN SHAMBLES']),
 H('dcells','lcz',7,3,'door','Камеры класса D','Class-D cells',['gameplay'],'dboy',['ПОБЕГИ БОЛЬШЕ НЕ РЕШАЮТ ИСХОД РАУНДА','Д-КЛАСС: ТО ЕСТЬ Я БЕЖАЛ ЗРЯ?'],['ESCAPES NO LONGER DECIDE THE WINNER','CLASS-D: SO I RAN FOR NOTHING?']),
 H('elevc','lcz',14,3,'elevator','Лифт C','Elevator C',['lcz-elevc','lcz-layouts'],'speaker',['ЛИФТ C','ПОТОМУ ЧТО A И B УЖЕ ЗАНЯТЫ'],['ELEVATOR C','BECAUSE A AND B WERE TAKEN'])
];
window.CL_CASSIE={
 ru:['ВНИМАНИЕ ВСЕМУ ПЕРСОНАЛУ. ЧЕЙНДЖЛОГ 15.0 ДОСТУПЕН ДЛЯ ЧТЕНИЯ','SCP-953 НЕ ОБНАРУЖЕНА. ПОВТОРЯЕМ: НЕ ОБНАРУЖЕНА. ПОСМОТРИТЕ НА СОСЕДА','ОТРЯД МОГ ЭПСИЛОН-11 ВОШЁЛ В КОМПЛЕКС. В ОТРЯДЕ: 4 БОЙЦА И КТО-ТО ЕЩЁ','НАПОМИНАНИЕ: ФЛАМИНГО НИЖЕ ЧЕЛОВЕКА НА 0,6 МЕТРА','НА ПОВЕРХНОСТИ ИДЁТ СНЕГ. ШАРФЫ ГРАЖДАНСКИМ НЕ ВЫДАЮТСЯ','ВСЕ ТЕЛЕФОНЫ КОМПЛЕКСА ЗВОНЯТ ОДНОВРЕМЕННО. ЭТО НОРМАЛЬНО','ПРОЧНОСТЬ СТЁКОЛ ОФИСНОЙ ЗОНЫ УВЕЛИЧЕНА. ПРОСЬБА НЕ ПРОВЕРЯТЬ ГОЛОВОЙ','SCP-079 ПЕРЕЖИЛ ДЕТОНАЦИЮ. ПЕРСОНАЛ, СОХРАНЯЙТЕ СПОКОЙСТВИЕ','ДОСТУП ЗАПРЕЩЁН. ШУТКА. ЧИТАЙТЕ НА ЗДОРОВЬЕ'],
 en:['ATTENTION ALL PERSONNEL. CHANGELOG 15.0 IS NOW AVAILABLE','SCP-953 NOT DETECTED. REPEAT: NOT DETECTED. CHECK YOUR NEIGHBOR','MTF UNIT EPSILON-11 HAS ENTERED THE FACILITY. SQUAD SIZE: 4 PLUS SOMEONE','REMINDER: A FLAMINGO IS 0.6 METERS SHORTER THAN A HUMAN','IT IS SNOWING ON SURFACE. SCARVES WILL NOT BE PROVIDED','ALL FACILITY PHONES ARE RINGING AT ONCE. THIS IS NORMAL','ENTRANCE ZONE GLASS HAS BEEN REINFORCED. DO NOT TEST WITH YOUR HEAD','SCP-079 HAS SURVIVED THE DETONATION. PERSONNEL, REMAIN CALM','ACCESS DENIED. JUST KIDDING. ENJOY READING']
};
window.CL_UI={
 ru:{title:'SCP: SL 15.0 — ТЕРМИНАЛ ИЗМЕНЕНИЙ',sub:'Публичный чейнджлог бета-версии v15.0.0 · Megapatch III',boot:'НАЖМИТЕ ЛЮБУЮ КЛАВИШУ ИЛИ КЛИКНИТЕ',dir:'КАТАЛОГ',search:'Поиск по изменениям…',tier:'УРОВЕНЬ ДОСТУПА',ap:'ВСП. ЭНЕРГИЯ',exp:'ОПЫТ',read:'изучено',items:'пунктов',dev:'Комментарий разработчиков',intercept:'РАДИОПЕРЕХВАТ',zone:'ЗОНА',close:'Закрыть',results:'Результаты поиска',noresults:'Ничего не найдено. SCP-953 спрятала все совпадения.',help:'Управление',helpText:'<b>Мышь</b> — карта плавно следит за курсором, как у 079<br><b>Зажать и тянуть</b> — двигать карту<br><b>Колёсико / щипок</b> — масштаб<br><b>Клик по комнате</b> — открыть досье<br><b>Tab</b> — каталог · <b>F</b> или <b>/</b> — поиск<br><b>1–4</b> — зоны · <b>Пробел</b> — общий вид · <b>Esc</b> — закрыть',apLow:'Недостаточно AP. Но мы откроем: мы не Northwood 😉',apStart:'079 теперь начинает раунд с 0 AP. Добро пожаловать.',tierUp:'ПОВЫШЕНИЕ УРОВНЯ ДОСТУПА',allRead:'Вы изучили весь чейнджлог. Уровень 5. Вы переживёте даже боеголовку.',copy:'Ссылка на раздел скопирована',disclaimer:'Неофициальный фанатский просмотрщик. Текст изменений — Northwood Studios (публичный документ). Перевод на русский — фанатский. Схема комнат — по иконкам карты 079 из 14.2.7 (перерисованы), раскладка — пример генерации 14.2.7, а не 15.0. Функции беты могут измениться.',source:'Исходный документ',sound:'Звук',follow:'Слежение мышью',overview:'Сводка',ovTitle:'Главное в 15.0',reset:'Общий вид',progress:'Прогресс'},
 en:{title:'SCP: SL 15.0 — CHANGELOG TERMINAL',sub:'Public v15.0.0 Beta changelog · Megapatch III',boot:'PRESS ANY KEY OR CLICK',dir:'DIRECTORY',search:'Search the changes…',tier:'ACCESS TIER',ap:'AUX POWER',exp:'EXP',read:'read',items:'items',dev:'Developer commentary',intercept:'RADIO INTERCEPT',zone:'ZONE',close:'Close',results:'Search results',noresults:'Nothing found. SCP-953 is hiding all the matches.',help:'Controls',helpText:'<b>Mouse</b> — the map smoothly follows your cursor, like 079’s<br><b>Click & drag</b> — pan the map<br><b>Wheel / pinch</b> — zoom<br><b>Click a room</b> — open its file<br><b>Tab</b> — directory · <b>F</b> or <b>/</b> — search<br><b>1–4</b> — zones · <b>Space</b> — overview · <b>Esc</b> — close',apLow:'Not enough AP. We’ll open it anyway — we’re not Northwood 😉',apStart:'079 now starts the round with 0 AP. Welcome.',tierUp:'ACCESS TIER INCREASED',allRead:'You have read the entire changelog. Tier 5. You’d survive the warhead.',copy:'Section link copied',disclaimer:'Unofficial fan-made viewer. Changelog text © Northwood Studios (public document). Room tiles are redrawn from the 14.2.7 SCP-079 map icons; the layout is a 14.2.7 generation sample, not 15.0. Beta features may change.',source:'Source document',sound:'Sound',follow:'Mouse follow',overview:'Overview',ovTitle:'15.0 highlights',reset:'Overview',progress:'Progress'}
};
window.CL_HIGHLIGHTS=[
 {hub:'signal-953',ru:['SCP-953','Новая играбельная аномалия: маскировка, Эссенция, Прыжок'],en:['SCP-953','New playable anomaly: disguise, Essence, Pounce']},
 {hub:'surface-yard',ru:['Поверхность','Полностью новая: снег, горы, ворота, генератор, колючка'],en:['Surface Zone','Fully reworked: snow, mountains, gates, generator, wire']},
 {hub:'intercom',ru:['Телефоны','Звони кому угодно по всему комплексу'],en:['Phones','Call anyone across the facility']},
 {hub:'c079',ru:['SCP-079','Старт с 0 AP, новый реген, может пережить боеголовку'],en:['SCP-079','Starts at 0 AP, new regen, can survive the warhead']},
 {hub:'armory',ru:['Оружие','Переработка прицелов, новый дробовик, гильзы и магазины'],en:['Weapons','Scope rework, stronger shotgun, dropped mags & shells']},
 {hub:'ui-room',ru:['Интерфейс','Новое меню, HUD способностей SCP, подсказки'],en:['Interface','New menu, SCP ability HUD, hint dialogs']}
];
})();
