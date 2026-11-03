/* TIGER TRACK - no frameworks, no subscriptions, no account needed. */
'use strict';

const STORE_KEY = 'tiger-track-data-v1';
const ACTIVITY = {
  run: { label: 'Run', icon: '🏃' },
  weights: { label: 'Weights', icon: '🏋️' },
  yoga: { label: 'Yoga', icon: '🧘' },
  other: { label: 'Other', icon: '✦' }
};
const RUN_WEEKS = [
  { speedLabel:'4 km', speedDistance:4, instructions:'Easy run + 4 × 20 sec strides', longDistance:10 },
  { speedLabel:'5 km', speedDistance:5, instructions:'4 × 2 min fast, 2 min easy', longDistance:12 },
  { speedLabel:'5 km', speedDistance:5, instructions:'3 × 4 min tempo, 3 min easy', longDistance:14 },
  { speedLabel:'4 km', speedDistance:4, instructions:'Easy run + 4 × 20 sec strides', longDistance:12 },
  { speedLabel:'6–7 km', speedDistance:null, instructions:'5 × 3 min fast, 2 min easy', longDistance:16 },
  { speedLabel:'6–7 km', speedDistance:null, instructions:'2 × 8 min tempo, 3 min easy', longDistance:19 },
  { speedLabel:'5 km', speedDistance:5, instructions:'4 × 2 min fast, 2 min easy', longDistance:22 },
  { speedLabel:'3–4 km', speedDistance:null, instructions:'Easy run + 3 × 20 sec strides', longDistance:25 }
];
const RUN_PLAN_TYPE = 'eight-week-25k';
const $ = id => document.getElementById(id);
const newId = () => (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`);

function localISO(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
function fromISO(s) {
  const [y,m,d] = String(s).split('-').map(Number);
  return new Date(y, m - 1, d, 12);
}
function dayOffset(date, offset) {
  const d = fromISO(date);
  d.setDate(d.getDate() + offset);
  return localISO(d);
}
function shortDate(date) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', weekday: 'short' }).format(fromISO(date));
}
function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
function multiline(text) { return esc(text).replace(/\n/g,'<br>'); }
function numeric(value) {
  if (value === '' || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
}
function defaultStore() { return { workouts: [], habits: [], checks: {}, tarot: {} }; }
function loadStore() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    if (parsed && Array.isArray(parsed.workouts) && Array.isArray(parsed.habits) && parsed.checks && typeof parsed.checks === 'object' && !Array.isArray(parsed.checks)) {
      // Keep the original key so previously saved workouts and habits survive app updates.
      return {...parsed, tarot: parsed.tarot && typeof parsed.tarot === 'object' && !Array.isArray(parsed.tarot) ? parsed.tarot : {}};
    }
  } catch (err) { console.warn('Could not load saved records:', err); }
  return defaultStore();
}
let store = loadStore();
let selectedHabitDate = localISO();
let activeTab = 'home';
let toastTimer;

function toast(message) {
  const el = $('toast');
  el.textContent = message;
  el.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('visible'), 3200);
}
function persist() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); }
  catch(err) { console.error(err); toast('Could not save. Check available browser storage and export a backup.'); }
  render();
}
function setTab(tab) {
  if (!['home','workouts','habits','tarot','history'].includes(tab)) return;
  activeTab = tab;
  for (const section of document.querySelectorAll('.screen')) section.hidden = section.id !== `screen-${tab}`;
  for (const btn of document.querySelectorAll('.nav-link')) {
    const active = btn.dataset.tab === tab;
    btn.classList.toggle('active', active);
    if (active) btn.setAttribute('aria-current','page'); else btn.removeAttribute('aria-current');
  }
  render();
  window.scrollTo({top:0,behavior:'instant'});
}
function activeHabits(date) { return store.habits.filter(h => !h.createdDate || h.createdDate <= date); }
function doneFor(date, habitId) { return !!store.checks[date]?.[habitId]; }
function completedOn(date) { return store.workouts.filter(w => w.date === date && w.status === 'completed'); }
function weekStart(date) {
  const d = fromISO(date);
  d.setDate(d.getDate() - (d.getDay() + 6) % 7);
  return localISO(d);
}
function weekWorkouts() {
  const start = weekStart(localISO());
  const end = dayOffset(start,6);
  return store.workouts.filter(w => w.status === 'completed' && w.date >= start && w.date <= end);
}
function anyActivity(date) {
  return completedOn(date).length > 0 || Object.values(store.checks[date] || {}).some(Boolean);
}
function getStreak() {
  let day = localISO();
  if (!anyActivity(day)) day = dayOffset(day, -1);
  let n = 0;
  while (n < 366 && anyActivity(day)) { n++; day = dayOffset(day,-1); }
  return n;
}
function metric(label, value) {
  return `<div class="metric"><strong>${esc(value)}</strong><small>${esc(label)}</small></div>`;
}
function empty(icon, title, message, actionLabel, action) {
  return `<div class="empty"><div class="empty-icon">${icon}</div><strong>${esc(title)}</strong><p>${esc(message)}</p>${action ? `<button class="btn btn-outline" type="button" data-action="${esc(action)}">${esc(actionLabel)}</button>` : ''}</div>`;
}
function habitCard(habit, date, canRemove = false) {
  const done = doneFor(date,habit.id);
  return `<article class="habit-card ${done ? 'is-done' : ''}">
    <button type="button" class="check-button" data-action="toggle-habit" data-id="${esc(habit.id)}" data-date="${esc(date)}" aria-label="${done ? 'Uncheck' : 'Complete'} ${esc(habit.name)}" aria-pressed="${done}">${done ? '✓' : ''}</button>
    <div class="habit-copy"><strong>${esc(habit.name)}</strong>${habit.target ? `<small>${esc(habit.target)}</small>` : ''}</div>
    ${canRemove ? `<button class="remove-button" type="button" data-action="remove-habit" data-id="${esc(habit.id)}" aria-label="Delete ${esc(habit.name)}">×</button>` : ''}
  </article>`;
}
function habitCards(date, canRemove = false) {
  const habits = activeHabits(date);
  return habits.length ? `<div class="card-list">${habits.map(h => habitCard(h,date,canRemove)).join('')}</div>` : empty('✦','No habits yet','Add your first daily habit to start building momentum.','+ Add habit','new-habit');
}
function showNum(n, suffix = '') { return n === null || n === undefined || n === '' ? '' : `${Number(n).toLocaleString('en-GB',{maximumFractionDigits:2})}${suffix}`; }
function paceString(distance, minutes) {
  if (!(distance > 0 && minutes > 0)) return '';
  const secs = Math.round((minutes * 60) / distance);
  return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2,'0')} /km`;
}
function workoutPills(w) {
  const pills = [];
  if (w.type === 'run') {
    if (w.plannedDistance !== null && w.plannedDistance !== undefined) pills.push(`Plan ${showNum(w.plannedDistance, ' km')}`);
    else if (w.plannedDistanceRange) pills.push(`Plan ${w.plannedDistanceRange}`);
    if (w.actualDistance !== null && w.actualDistance !== undefined) pills.push(`${showNum(w.actualDistance, ' km')} run`);
    if (w.duration !== null && w.duration !== undefined) pills.push(`${showNum(w.duration, ' min')}`);
    const pace = paceString(w.actualDistance, w.duration);
    if (pace) pills.push(pace);
    if (w.effort) pills.push(w.effort);
  } else {
    if (w.duration !== null && w.duration !== undefined) pills.push(`${showNum(w.duration, ' min')}`);
    if (w.type === 'yoga' && w.yogaStyle) pills.push(w.yogaStyle);
    if (w.type === 'weights' && w.exercises?.length) pills.push(`${w.exercises.length} exercise${w.exercises.length === 1 ? '' : 's'}`);
  }
  return pills.length ? `<div class="workout-details">${pills.map(p => `<span class="detail-pill">${esc(p)}</span>`).join('')}</div>` : '';
}
function workoutCard(w, compact = false) {
  const info = ACTIVITY[w.type] || ACTIVITY.other;
  const text = compact ? (w.status === 'completed' ? w.actual : w.plan) : null;
  const desc = compact ? (text ? `<p class="workout-description">${multiline(text)}</p>` : '')
    : `${w.plan ? `<p class="workout-description"><strong>Planned:</strong> ${multiline(w.plan)}</p>` : ''}${w.actual ? `<p class="workout-description"><strong>Did:</strong> ${multiline(w.actual)}</p>` : ''}`;
  const exercises = !compact && w.type === 'weights' && w.exercises?.length
    ? `<p class="workout-description"><strong>Exercises:</strong> ${w.exercises.map(x => `${esc(x.name)} (${esc(x.sets || '?')} × ${esc(x.reps || '?')}${x.weight !== '' && x.weight !== null ? ` @ ${esc(x.weight)} kg` : ''})`).join(' · ')}</p>` : '';
  return `<article class="workout-card" data-activity="${esc(w.type)}"><div class="workout-top"><div class="activity-icon" aria-hidden="true">${info.icon}</div><div class="workout-title"><strong>${esc(w.title)}</strong><small>${esc(info.label)} · ${esc(shortDate(w.date))}</small></div><span class="status ${w.status === 'completed' ? 'completed' : ''}">${w.status === 'completed' ? '✓ Done' : 'Planned'}</span></div>${desc}${exercises}${workoutPills(w)}<div class="workout-actions">${w.status !== 'completed' ? `<button type="button" data-action="mark-done" data-id="${esc(w.id)}">Log result</button>` : ''}<button type="button" data-action="edit-workout" data-id="${esc(w.id)}">Edit</button>${compact ? '' : `<button type="button" class="danger-link" data-action="remove-workout" data-id="${esc(w.id)}">Delete</button>`}</div></article>`;
}
function renderHome() {
  const today = localISO();
  $('today-label').textContent = new Intl.DateTimeFormat('en-GB',{weekday:'long',day:'numeric',month:'long'}).format(new Date());
  const week = weekWorkouts();
  const hs = activeHabits(today);
  const checked = hs.filter(h => doneFor(today,h.id)).length;
  $('home-metrics').innerHTML = metric('Day streak',`${getStreak()} 🔥`) + metric('Workouts this week',week.length) + metric('Habits today',`${checked}/${hs.length}`);
  $('home-habits').innerHTML = habitCards(today);
  const workouts = store.workouts.filter(w => w.date === today).sort((a,b)=>String(a.title).localeCompare(String(b.title)));
  const reading = store.tarot[localISO()];
  $('home-tarot-message').textContent = reading?.cards?.length ? `Today’s pull: ${reading.cards.map(c => TAROT_DECK.find(x => x.id === c.id)?.name || 'Your card').join(', ')}. Take a moment to reflect.` : 'Pull a card and see what resonates today.';
  $('home-workouts').innerHTML = workouts.length ? `<div class="card-list">${workouts.map(w=>workoutCard(w,true)).join('')}</div>` : empty('↗','Nothing scheduled today','Plan a session or log one after you finish.','+ Plan a workout','new-workout');
}
function renderRunPlanOverview() {
  const sessions = store.workouts.filter(w => w.trainingPlan === RUN_PLAN_TYPE && w.planStart);
  const starts = [...new Set(sessions.map(w => w.planStart))].sort().reverse();
  $('run-plan-overview').innerHTML = starts.map((start, planIndex) => {
    const planSessions = sessions.filter(w => w.planStart === start);
    const done = planSessions.filter(w => w.status === 'completed').length;
    const rows = RUN_WEEKS.map((week, i) => {
      const ws = planSessions.find(w => w.weekNumber === i + 1 && w.sessionKind === 'speed');
      const wl = planSessions.find(w => w.weekNumber === i + 1 && w.sessionKind === 'long');
      const one = w => w ? `<div class="running-session"><div><strong>${w.sessionKind === 'speed' ? '⚡ Speed' : '↗ Long'} · ${esc(shortDate(w.date))}</strong><small>${esc(w.sessionKind === 'speed' ? `${week.speedLabel} · ${week.instructions}` : `${week.longDistance} km comfortable distance`)}</small></div><button type="button" data-action="${w.status === 'completed' ? 'edit-workout' : 'mark-done'}" data-id="${esc(w.id)}" aria-label="${w.status === 'completed' ? 'Edit' : 'Log'} ${esc(w.title)}">${w.status === 'completed' ? '✓ Edit' : 'Log'}</button></div>` : '';
      return `<div class="running-week"><div class="running-week-title">WEEK ${i + 1}</div>${one(ws)}${one(wl)}${!ws && !wl ? '<small class="muted">Sessions removed</small>' : ''}</div>`;
    }).join('');
    return `<details class="run-plan-overview" ${planIndex === 0 ? 'open' : ''}><summary><span><strong>8-week plan · ${esc(shortDate(start))}</strong><small>${done} of ${planSessions.length} sessions completed</small></span><span class="summary-chevron" aria-hidden="true">⌄</span></summary><div class="running-weeks">${rows}</div></details>`;
  }).join('');
}
function renderWorkouts() {
  const filter = $('workout-filter').value;
  const workouts = store.workouts.filter(w=>filter === 'all' || w.type === filter).sort((a,b)=>b.date.localeCompare(a.date) || String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
  $('workout-list').innerHTML = workouts.length ? `<div class="card-list">${workouts.map(w=>workoutCard(w)).join('')}</div>` : empty('🏃','No sessions to show','Your planned and completed workouts will appear here.','+ Add a workout','new-workout');
}
function renderHabits() {
  const today = localISO();
  $('habit-date').max = today;
  if (selectedHabitDate > today) selectedHabitDate = today;
  $('habit-date').value = selectedHabitDate;
  $('habit-day-caption').textContent = selectedHabitDate === today ? 'Today' : shortDate(selectedHabitDate);
  const hs = activeHabits(selectedHabitDate);
  const done = hs.filter(h => doneFor(selectedHabitDate,h.id)).length;
  $('habit-progress').innerHTML = `<div class="progress-card"><div class="progress-card-top"><span>DAILY PROGRESS</span><span>${done} / ${hs.length} done</span></div><div class="progress-track"><div class="progress-fill" style="width:${hs.length ? Math.round(done / hs.length * 100) : 0}%"></div></div></div>`;
  $('habit-list').innerHTML = habitCards(selectedHabitDate,true);
}
function renderHistory() {
  const week = weekWorkouts();
  const mins = week.reduce((sum,w)=>sum+(numeric(w.duration)||0),0);
  const km = week.reduce((sum,w)=>sum+(w.type==='run' ? (numeric(w.actualDistance)||0) : 0),0);
  $('history-metrics').innerHTML = metric('Sessions / week',week.length) + metric('Minutes / week',Math.round(mins)) + metric('Running km / week',showNum(km));
  const days = Array.from({length:7},(_,i)=>dayOffset(localISO(),i-6));
  let completedChecks = 0, possibleChecks = 0;
  const bars = days.map(date=>{
    const hs = activeHabits(date); const done = hs.filter(h=>doneFor(date,h.id)).length;
    completedChecks += done; possibleChecks += hs.length;
    const percent = hs.length ? Math.round(done/hs.length * 100) : 0;
    return `<div class="day-chart ${date === localISO() ? 'is-today' : ''}" title="${esc(shortDate(date))}: ${done}/${hs.length} habits"><div class="chart-track"><div class="chart-bar" style="height:${percent}%"></div></div><span>${esc(new Intl.DateTimeFormat('en-GB',{weekday:'short'}).format(fromISO(date)))}</span></div>`;
  });
  $('history-chart').innerHTML = `<div class="chart-card"><div class="week-chart">${bars.join('')}</div><div class="chart-caption">${possibleChecks ? `${completedChecks} of ${possibleChecks} daily habit check-ins this week` : 'Add daily habits to start seeing your progress here'}</div></div>`;
  const workouts = store.workouts.filter(w=>w.status === 'completed').sort((a,b)=>b.date.localeCompare(a.date));
  $('history-workouts').innerHTML = workouts.length ? `<div class="card-list">${workouts.map(w=>workoutCard(w,true)).join('')}</div>` : empty('▥','Your story starts here','Complete a workout and it will appear in your logbook.','+ Add workout','new-workout');
}
function render() { renderHome(); renderWorkouts(); renderRunPlanOverview(); renderHabits(); renderHistory(); renderTarot(); }

function openRunPlan() {
  $('run-plan-form').reset();
  $('run-plan-start').value = weekStart(localISO());
  $('run-plan-picker').innerHTML = RUN_WEEKS.map((week, i) => `<div class="run-plan-picker-week">
    <div class="run-plan-picker-heading"><strong>WEEK ${i + 1}</strong><span class="run-plan-week-dates" id="week-dates-${i}"></span></div>
    <div class="run-plan-picker-session"><div><strong>⚡ Speed · ${esc(week.speedLabel)}</strong><small>${esc(week.instructions)}</small></div><label class="day-select-label">Day<select class="speed-day" aria-label="Week ${i + 1} speed run day" data-week="${i}"><option value="1">Tuesday</option><option value="2">Wednesday</option></select><span class="run-plan-selected-date" id="speed-date-${i}"></span></label></div>
    <div class="run-plan-picker-session"><div><strong>↗ Distance · ${week.longDistance} km</strong><small>Long run</small></div><label class="day-select-label">Day<select class="long-day" aria-label="Week ${i + 1} distance run day" data-week="${i}"><option value="5">Saturday</option><option value="6">Sunday</option></select><span class="run-plan-selected-date" id="long-date-${i}"></span></label></div>
  </div>`).join('');
  updateRunPlanDates();
  $('run-plan-dialog').showModal();
}
function updateRunPlanDates() {
  if (!$('run-plan-start').value) return;
  const monday = weekStart($('run-plan-start').value);
  $('run-plan-date-hint').textContent = `Week 1: ${shortDate(monday)} – ${shortDate(dayOffset(monday,6))}`;
  for (let i = 0; i < RUN_WEEKS.length; i++) {
    const start = dayOffset(monday,7*i);
    $(`week-dates-${i}`).textContent = `${shortDate(start)} – ${shortDate(dayOffset(start,6))}`;
    $(`speed-date-${i}`).textContent = shortDate(dayOffset(start,Number(document.querySelector(`.speed-day[data-week="${i}"]`).value)));
    $(`long-date-${i}`).textContent = shortDate(dayOffset(start,Number(document.querySelector(`.long-day[data-week="${i}"]`).value)));
  }
}
function saveRunPlan(event) {
  event.preventDefault();
  if (!$('run-plan-form').reportValidity()) return;
  const monday = weekStart($('run-plan-start').value);
  if (store.workouts.some(w => w.trainingPlan === RUN_PLAN_TYPE && w.planStart === monday)) {
    toast('A running plan already exists for that starting week. Edit its sessions instead.');
    return;
  }
  const now = new Date().toISOString();
  const planned = [];
  RUN_WEEKS.forEach((week,i) => {
    const speedDay = Number(document.querySelector(`.speed-day[data-week="${i}"]`).value);
    const longDay = Number(document.querySelector(`.long-day[data-week="${i}"]`).value);
    const common = {type:'run', status:'planned', actual:'', actualDistance:null, duration:null, effort:'', exercises:[], createdAt:now,
      trainingPlan:RUN_PLAN_TYPE, planStart:monday, weekNumber:i+1};
    planned.push({...common, id:newId(), sessionKind:'speed',date:dayOffset(monday,7*i+speedDay), title:`Week ${i+1} · Speed ${week.speedLabel}`,
      plan:`${week.speedLabel} speed session\n${week.instructions}`, plannedDistance:week.speedDistance,
      plannedDistanceRange:week.speedDistance === null ? week.speedLabel : ''});
    planned.push({...common, id:newId(), sessionKind:'long',date:dayOffset(monday,7*i+longDay), title:`Week ${i+1} · Long ${week.longDistance} km`,
      plan:`${week.longDistance} km long-distance run`,plannedDistance:week.longDistance,plannedDistanceRange:''});
  });
  store.workouts.push(...planned);
  $('run-plan-dialog').close();
  $('workout-filter').value = 'run';
  setTab('workouts');
  persist();
  toast('Your 16 planned runs were added!');
}

function typeFields() {
  const type = $('workout-type').value;
  for (const node of document.querySelectorAll('.run-only')) node.hidden = type !== 'run';
  for (const node of document.querySelectorAll('.weights-only')) node.hidden = type !== 'weights';
  for (const node of document.querySelectorAll('.yoga-only')) node.hidden = type !== 'yoga';
  for (const node of document.querySelectorAll('.non-run-only')) node.hidden = type === 'run';
  if (type === 'weights' && !$('exercise-rows').children.length) addExercise();
}
function addExercise(data = {}) {
  const row = document.createElement('div');
  row.className = 'ex-row';
  row.innerHTML = `<input type="text" maxlength="80" class="ex-name" aria-label="Exercise name" placeholder="Exercise" value="${esc(data.name || '')}"><input type="number" min="0" max="1000" step="1" class="ex-sets" aria-label="Sets" placeholder="Sets" value="${esc(data.sets ?? '')}"><input type="number" min="0" max="1000" step="1" class="ex-reps" aria-label="Reps" placeholder="Reps" value="${esc(data.reps ?? '')}"><input type="number" min="0" max="2000" step="0.5" class="ex-weight" aria-label="Weight in kilograms" placeholder="kg" value="${esc(data.weight ?? '')}"><button type="button" class="remove-button" aria-label="Remove exercise" data-action="remove-exercise">×</button>`;
  $('exercise-rows').appendChild(row);
}
function openWorkout(id, markDone = false) {
  $('workout-form').reset();
  $('exercise-rows').innerHTML = '';
  const w = store.workouts.find(x=>x.id === id);
  $('workout-dialog-title').textContent = w ? 'Edit workout' : 'New workout';
  $('workout-id').value = w?.id || '';
  $('workout-type').value = w?.type || 'run';
  $('workout-date').value = w?.date || localISO();
  $('workout-title').value = w?.title || '';
  $('workout-status').value = markDone ? 'completed' : (w?.status || 'planned');
  $('workout-plan').value = w?.plan || '';
  $('workout-actual').value = w?.actual || '';
  $('run-planned-distance').value = w?.plannedDistance ?? '';
  $('run-distance-range-note').textContent = w?.plannedDistanceRange && w.plannedDistance == null ? `Original target: ${w.plannedDistanceRange} (you can enter a single distance instead)` : '';
  $('run-distance').value = w?.actualDistance ?? '';
  $('run-duration').value = w?.type === 'run' ? (w.duration ?? '') : '';
  $('other-duration').value = w?.type !== 'run' ? (w?.duration ?? '') : '';
  $('run-effort').value = w?.effort || '';
  $('yoga-style').value = w?.yogaStyle || '';
  (w?.exercises || []).forEach(x => addExercise(x));
  typeFields();
  $('workout-dialog').showModal();
}
function saveWorkout(event) {
  event.preventDefault();
  if (!$('workout-form').reportValidity()) return;
  const id = $('workout-id').value;
  const previous = store.workouts.find(w=>w.id === id);
  const type = $('workout-type').value;
  const exercises = type === 'weights' ? [...document.querySelectorAll('.ex-row')].map(row => ({
    name: row.querySelector('.ex-name').value.trim(),
    sets: row.querySelector('.ex-sets').value.trim(),
    reps: row.querySelector('.ex-reps').value.trim(),
    weight: row.querySelector('.ex-weight').value.trim()
  })).filter(x=>x.name) : [];
  const workout = {
    id: id || newId(), createdAt: previous?.createdAt || new Date().toISOString(),
    type, date:$('workout-date').value, title:$('workout-title').value.trim(),
    status:$('workout-status').value, plan:$('workout-plan').value.trim(), actual:$('workout-actual').value.trim(),
    plannedDistance: type === 'run' ? numeric($('run-planned-distance').value) : null,
    actualDistance: type === 'run' ? numeric($('run-distance').value) : null,
    duration: numeric(type === 'run' ? $('run-duration').value : $('other-duration').value),
    effort: type === 'run' ? $('run-effort').value : '',
    yogaStyle: type === 'yoga' ? $('yoga-style').value : '',
    exercises,
    ...(previous?.trainingPlan ? {trainingPlan:previous.trainingPlan,planStart:previous.planStart,weekNumber:previous.weekNumber,sessionKind:previous.sessionKind} : {}),
    plannedDistanceRange: type === 'run' && !String($('run-planned-distance').value).trim() ? (previous?.plannedDistanceRange || '') : ''
  };
  if (!workout.title) return;
  if (previous) store.workouts = store.workouts.map(w=>w.id === id ? workout : w);
  else store.workouts.push(workout);
  $('workout-dialog').close();
  persist();
  toast(previous ? 'Workout updated' : 'Workout saved');
}
function saveHabit(event) {
  event.preventDefault();
  if (!$('habit-form').reportValidity()) return;
  const name = $('habit-name').value.trim();
  if (!name) return;
  store.habits.push({id:newId(),name,target:$('habit-target').value.trim(),createdDate:localISO()});
  $('habit-dialog').close();
  persist();
  toast('Daily habit added');
}
function exportData() {
  const data = JSON.stringify({app:'Tiger Track',version:2,exportedAt:new Date().toISOString(), ...store},null,2);
  const url = URL.createObjectURL(new Blob([data],{type:'application/json'}));
  const link = document.createElement('a');
  link.href = url;
  link.download = `tiger-track-backup-${localISO()}.json`;
  document.body.append(link); link.click(); link.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 2500);
  toast('Backup created. Save it somewhere safe.');
}
async function importData(file) {
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const valid = data && Array.isArray(data.workouts) && Array.isArray(data.habits) && data.checks && typeof data.checks === 'object' && !Array.isArray(data.checks);
    if (!valid) throw new Error('This is not a Tiger Track backup.');
    if (!confirm('Import this backup? Your current workouts, habits, and tarot readings on this device will be replaced.')) return;
    store = {workouts:data.workouts,habits:data.habits,checks:data.checks,tarot:data.tarot && typeof data.tarot === 'object' && !Array.isArray(data.tarot) ? data.tarot : {}};
    $('settings-dialog').close();
    persist();
    toast('Backup restored');
  } catch(err) { toast(err.message || 'Could not read backup file.'); }
  finally { $('import-file').value = ''; }
}
function handleClick(event) {
  const tabButton = event.target.closest('[data-tab]');
  if (tabButton) { setTab(tabButton.dataset.tab); return; }
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const {action,id,date} = button.dataset;
  if (action === 'new-workout') openWorkout();
  if (action === 'new-run-plan') openRunPlan();
  if (action === 'draw-tarot') drawTarot();
  if (action === 'close-run-plan') $('run-plan-dialog').close();
  if (action === 'close-workout') $('workout-dialog').close();
  if (action === 'new-habit') { $('habit-form').reset(); $('habit-dialog').showModal(); }
  if (action === 'close-habit') $('habit-dialog').close();
  if (action === 'settings') $('settings-dialog').showModal();
  if (action === 'close-settings') $('settings-dialog').close();
  if (action === 'add-exercise') addExercise();
  if (action === 'remove-exercise') button.closest('.ex-row')?.remove();
  if (action === 'edit-workout') openWorkout(id);
  if (action === 'mark-done') openWorkout(id,true);
  if (action === 'remove-workout') {
    if (confirm('Delete this workout? This cannot be undone.')) {store.workouts = store.workouts.filter(w=>w.id !== id); persist(); toast('Workout deleted');}
  }
  if (action === 'toggle-habit') {
    const day = date || localISO();
    store.checks[day] ||= {};
    store.checks[day][id] = !store.checks[day][id];
    persist();
  }
  if (action === 'remove-habit') {
    const habit = store.habits.find(h=>h.id === id);
    if (habit && confirm(`Delete “${habit.name}”? Its saved check-ins will also be removed.`)) {
      store.habits = store.habits.filter(h=>h.id !== id);
      Object.values(store.checks).forEach(day=>delete day[id]);
      persist(); toast('Habit deleted');
    }
  }
  if (action === 'export-data') exportData();
  if (action === 'clear-data') {
    if (confirm('Delete ALL workouts, habits, check-ins and tarot readings on this device? Export a backup first. This cannot be undone.')) {
      store = defaultStore();
      selectedHabitDate = localISO();
      $('settings-dialog').close();
      persist(); toast('All records deleted');
    }
  }
}


/* Daily tarot ritual: 78 traditional cards, original explanatory text in tarot-data.js. */
const TAROT_POSITIONS = ['Mind', 'Body', 'Spirit'];
function randomIndex(length) {
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const buf = new Uint32Array(1);
    const max = Math.floor(4294967296 / length) * length;
    let value;
    do { crypto.getRandomValues(buf); value = buf[0]; } while (value >= max);
    return value % length;
  }
  return Math.floor(Math.random() * length);
}
function drawTarot() {
  const date = localISO();
  if (store.tarot[date] && !confirm('Replace today’s reading? The old cards and your reflection for today will be replaced.')) return;
  const count = Number($('tarot-spread').value) === 3 ? 3 : 1;
  const remaining = TAROT_DECK.map(card => card.id);
  const cards = [];
  for (let index = 0; index < count; index++) {
    const chosen = remaining.splice(randomIndex(remaining.length),1)[0];
    cards.push({id:chosen, orientation:randomIndex(2) === 0 ? 'upright' : 'reversed'});
  }
  store.tarot[date] = {date, cards, reflection:'', createdAt:new Date().toISOString()};
  persist();
  $('tarot-today').scrollIntoView({behavior:'smooth', block:'start'});
  toast('Your daily reading is saved');
}
function tarotSymbol(card) {
  if (card.arcana === 'major') return '✷';
  return ({Wands:'✺', Cups:'≈', Swords:'✦', Pentacles:'❀'})[card.suit] || '✷';
}
function tarotCardMarkup(pull, index, three = false) {
  const card = TAROT_DECK.find(x => x.id === pull.id);
  if (!card) return '';
  const orientation = pull.orientation === 'reversed' ? 'reversed' : 'upright';
  const focus = three ? TAROT_POSITIONS[index] : 'Today’s focus';
  return `<article class="reading-card ${esc(card.suit.toLowerCase().replace(/\s+/g,'-'))}">
    <div class="tarot-card-art" aria-label="Illustrative card for ${esc(card.name)}">
      <div class="tarot-art-inner"><div class="tarot-art-stars" aria-hidden="true">✧ · ✦ · ✧</div><div class="tarot-art-arch"><div class="tarot-art-sun" aria-hidden="true"></div><div class="tarot-art-symbol" aria-hidden="true">${tarotSymbol(card)}</div><div class="tarot-art-ripple" aria-hidden="true"></div></div><div class="tarot-card-caption">TIGER TRACK TAROT</div></div>
    </div>
    <div class="reading-copy"><p class="eyebrow">${esc(focus)} · ${esc(card.suit)}</p><h3>${esc(card.name)}</h3>
    <span class="tarot-orientation">${orientation === 'reversed' ? '↶ Reversed' : '✧ Upright'}</span>
    <p class="tarot-meaning">${esc(card[orientation])}</p>
    <p class="tarot-prompt"><strong>For your journal:</strong> ${esc(card.prompt)}</p></div>
  </article>`;
}
function tarotReadingMarkup(reading, historical = false) {
  const isThree = reading.cards.length === 3;
  return `<div class="tarot-reading-grid ${isThree ? 'three-cards' : ''} ${historical ? 'past-reading' : ''}">${reading.cards.map((pull,index)=>tarotCardMarkup(pull,index,isThree)).join('')}</div>`;
}
function renderTarot() {
  const today = localISO();
  const reading = store.tarot[today];
  $('tarot-spread').disabled = false;
  $('draw-tarot-button').textContent = reading ? '↻ Redraw today’s cards' : '✦ Draw my cards';
  if (reading?.cards?.length) {
    $('tarot-today').innerHTML = `<div class="section-heading tarot-reading-heading"><div><p class="eyebrow">${esc(shortDate(today))}</p><h2>Your cards for today</h2></div></div>${tarotReadingMarkup(reading)}`;
    $('tarot-reflection-form').hidden = false;
    if (document.activeElement !== $('tarot-reflection')) $('tarot-reflection').value = reading.reflection || '';
  } else {
    $('tarot-today').innerHTML = `<div class="tarot-empty"><span aria-hidden="true">✧ ☾ ✧</span><p>There’s no card for today yet. Begin whenever you feel like it.</p></div>`;
    $('tarot-reflection-form').hidden = true;
    $('tarot-reflection').value = '';
  }
  const history = Object.keys(store.tarot).filter(day => day < today && Array.isArray(store.tarot[day]?.cards)).sort().reverse();
  $('tarot-history').innerHTML = history.length ? `<div class="tarot-history-list">${history.map(day=>{
    const past = store.tarot[day];
    const names = past.cards.map(pull => TAROT_DECK.find(x=>x.id===pull.id)?.name || 'Card').join(' · ');
    return `<details class="tarot-history-item"><summary><span><strong>${esc(shortDate(day))}</strong><small>${esc(names)}</small></span><span aria-hidden="true">⌄</span></summary>${tarotReadingMarkup(past,true)}${past.reflection ? `<div class="saved-reflection"><strong>Your reflection</strong><p>${multiline(past.reflection)}</p></div>` : ''}</details>`;
  }).join('')}</div>` : `<div class="empty"><div class="empty-icon">✦</div><strong>A journal in the making</strong><p>Your previous cards and reflections will live here.</p></div>`;
}
function saveTarotReflection(event) {
  event.preventDefault();
  const reading = store.tarot[localISO()];
  if (!reading) { toast('Draw a card first'); return; }
  reading.reflection = $('tarot-reflection').value.trim();
  persist();
  toast('Reflection saved');
}

document.addEventListener('click',handleClick);
$('workout-type').addEventListener('change', typeFields);
$('workout-form').addEventListener('submit',saveWorkout);
$('run-plan-form').addEventListener('submit',saveRunPlan);
$('run-plan-start').addEventListener('change',updateRunPlanDates);
$('run-plan-picker').addEventListener('change',updateRunPlanDates);
$('habit-form').addEventListener('submit',saveHabit);
$('tarot-reflection-form').addEventListener('submit',saveTarotReflection);
$('habit-date').addEventListener('change',event=>{
  selectedHabitDate = event.target.value || localISO();
  if (selectedHabitDate > localISO()) selectedHabitDate=localISO();
  renderHabits();
});
$('workout-filter').addEventListener('change',renderWorkouts);
$('import-file').addEventListener('change',e=>importData(e.target.files[0]));
render();
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
  window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(err=>console.warn('Offline support unavailable:',err)));
}
