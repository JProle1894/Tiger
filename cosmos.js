/* Tiger Track v5 | lunar resets & local menstrual tracking.
   No cloud calls, analytics, or personal-data transmission. */
'use strict';

// The true-new-moon approximation below follows the standard Meeus lunar-phase
// corrections. Times are approximate UTC; small numerical/model differences are
// expected. The on-device calculation requires no subscription or network.
const SYNODIC_DAYS = 29.530588853;
const COSMOS_DAY = 86400000;
const COSMOS_MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
let selectedCycleDate = null;
let displayedCycleMonth = null;
function sinDegrees(angle) { return Math.sin(angle * Math.PI / 180); }
function moonMoment(k) {
  const T = k / 1236.85;
  const T2 = T*T, T3 = T2*T, T4 = T3*T;
  const E = 1 - 0.002516*T - 0.0000074*T2;
  const M = 2.5534 + 29.10535670*k - 0.0000014*T2 - 0.00000011*T3;
  const MP = 201.5643 + 385.81693528*k + 0.0107582*T2 + 0.00001238*T3 - 0.000000058*T4;
  const F = 160.7108 + 390.67050284*k - 0.0016118*T2 - 0.00000227*T3 + 0.000000011*T4;
  const O = 124.7746 - 1.56375588*k + 0.0020672*T2 + 0.00000215*T3;
  let jd = 2451550.09765 + SYNODIC_DAYS*k + 0.0001337*T2 - 0.000000150*T3 + 0.00000000073*T4;
  jd += -0.40720*sinDegrees(MP) + 0.17241*E*sinDegrees(M) + 0.01608*sinDegrees(2*MP) + 0.01039*sinDegrees(2*F)
      + 0.00739*E*sinDegrees(MP-M) - 0.00514*E*sinDegrees(MP+M) + 0.00208*E*E*sinDegrees(2*M)
      - 0.00111*sinDegrees(MP-2*F) - 0.00057*sinDegrees(MP+2*F) + 0.00056*E*sinDegrees(2*MP+M)
      - 0.00042*sinDegrees(3*MP) + 0.00042*E*sinDegrees(M+2*F) + 0.00038*E*sinDegrees(M-2*F)
      - 0.00024*E*sinDegrees(2*MP-M) - 0.00017*sinDegrees(O) - 0.00007*sinDegrees(MP+2*M)
      + 0.00004*sinDegrees(2*MP-2*F) + 0.00004*sinDegrees(3*M)
      + 0.00003*sinDegrees(MP+M-2*F) + 0.00003*sinDegrees(2*MP+2*F)
      - 0.00003*sinDegrees(MP+M+2*F) + 0.00003*sinDegrees(MP-M+2*F)
      - 0.00002*sinDegrees(MP-M-2*F) - 0.00002*sinDegrees(3*MP+M) + 0.00002*sinDegrees(4*MP);
  const additional = [
    [299.77+0.107408*k-0.009173*T2,0.000325],
    [251.88+0.016321*k,0.000165], [251.83+26.651886*k,0.000164],
    [349.42+36.412478*k,0.000126], [84.66+18.206239*k,0.000110],
    [141.74+53.303771*k,0.000062], [207.14+2.453732*k,0.000060],
    [154.84+7.306860*k,0.000056], [34.52+27.261239*k,0.000047],
    [207.19+0.121824*k,0.000042], [291.34+1.844379*k,0.000040],
    [161.72+24.198154*k,0.000037], [239.56+25.513099*k,0.000035],
    [331.55+3.592518*k,0.000023]
  ];
  jd += additional.reduce((sum, [angle, factor]) => sum + factor * sinDegrees(angle), 0);
  // Julian ephemeris days are Terrestrial Time; approximate TT–UTC in the
  // modern era to avoid an additional online dependency. This is not an
  // observatory-grade calendar for distant historical or future dates.
  const yearEstimate = 2000 + k / 12.3685;
  const deltaSeconds = 64.7 + 0.35 * (yearEstimate - 2000); // ~74s in 2026
  return new Date((jd - 2440587.5)*COSMOS_DAY - deltaSeconds*1000);
}
function moonsAround(now = new Date()) {
  const jd = now.getTime()/COSMOS_DAY + 2440587.5;
  const nearK = Math.floor((jd - 2451550.09765)/SYNODIC_DAYS);
  return Array.from({length:9}, (_,i) => ({k:nearK+i-3,time:moonMoment(nearK+i-3)}));
}
function moonSelection(now = new Date()) {
  const moons = moonsAround(now);
  const recent = moons.filter(x => x.time <= now).at(-1);
  const upcoming = moons.find(x => x.time > now);
  // Keep this month's ritual featured for its first three days; otherwise
  // offer the next new moon so users can prepare their intentions ahead.
  const featured = recent && now - recent.time < 3*COSMOS_DAY ? recent : (upcoming || recent);
  return {recent, upcoming, featured};
}
function moonDate(date) { return new Intl.DateTimeFormat('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(date); }
function moonTime(date) { return new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',timeZoneName:'short'}).format(date); }
function dateDifference(a,b) { return Math.round((fromISO(a).getTime()-fromISO(b).getTime())/COSMOS_DAY); }
function addDaysISO(date,days) { return dayOffset(date,days); }
function moveMonth(start, step) { return new Date(start.getFullYear(),start.getMonth()+step,1,12); }
function isoIsValid(value) { return /^\d{4}-\d{2}-\d{2}$/.test(String(value || '')) && localISO(fromISO(value)) === value; }

function loadCurrentReset() {
  const featured = moonSelection().featured;
  const key = `newmoon-${featured.k}`;
  const entry = store.cosmos.resets[key] || {};
  const ids = ['celebrate','release','intention','movement','care'];
  ids.forEach(field => { $(`reset-${field}`).value = entry[field] || ''; });
  $('new-moon-reset-form').dataset.lunation = key;
  return featured;
}
function saveReset(event) {
  event.preventDefault();
  const key = $('new-moon-reset-form').dataset.lunation;
  if (!/^newmoon--?\d+$/.test(key)) return;
  store.cosmos.resets[key] = {
    date:moonMoment(Number(key.slice(8))).toISOString(),
    ...Object.fromEntries(['celebrate','release','intention','movement','care'].map(field => [field,$(`reset-${field}`).value.trim()])),
    updatedAt:new Date().toISOString()
  };
  persist();
  toast('Your new-moon intentions are saved ✧');
}
function renderResets() {
  const selection = moonSelection();
  const featured = selection.featured;
  const date = moonDate(featured.time);
  const future = featured.time > new Date();
  $('reset-date-note').textContent = `${future ? 'Preparing for' : 'Reflecting on'} the new moon of ${date} · ${moonTime(featured.time)}`;
  if ($('new-moon-reset-form').dataset.lunation !== `newmoon-${featured.k}`) loadCurrentReset();
  const entries = Object.entries(store.cosmos.resets).filter(([key,entry])=>key !== `newmoon-${featured.k}` && entry && typeof entry==='object').sort((a,b)=>String(b[1].date||'').localeCompare(String(a[1].date||'')));
  const fields = [['celebrate','What went well'],['release','Letting go'],['intention','Intention'],['movement','Movement & wellbeing'],['care','Self-care']];
  $('reset-history').innerHTML = entries.length ? entries.map(([key,entry]) => {
    const label = entry.date ? moonDate(new Date(entry.date)) : key;
    const content = fields.filter(([field])=>entry[field]).map(([field,label])=>`<p><strong>${esc(label)}:</strong> ${multiline(entry[field])}</p>`).join('');
    return `<details class="reset-history-item"><summary>✧ ${esc(label)}</summary>${content || '<p>No notes saved for this reset.</p>'}</details>`;
  }).join('') : '<p class="empty-cosmos">Your previous moon resets will collect here, one chapter at a time.</p>';
  if (selection.upcoming) {
    const diff = selection.upcoming.time.getTime()-Date.now();
    const days = Math.floor(diff/COSMOS_DAY), hours = Math.floor(diff % COSMOS_DAY / 3600000);
    $('cosmos-moon-date').textContent = moonDate(selection.upcoming.time);
    $('cosmos-moon-countdown').textContent = `About ${days} day${days===1?'':'s'} and ${hours} hour${hours===1?'':'s'} away · ${moonTime(selection.upcoming.time)}`;
    $('moon-home-next').textContent = `Next new moon: ${moonDate(selection.upcoming.time)}. A little pause to set intentions.`;
  }
}
function savePeriod(event) {
  event.preventDefault();
  const start = $('period-start').value;
  const end = $('period-end').value;
  const today = localISO();
  if (!isoIsValid(start) || start > today || (end && (!isoIsValid(end) || end < start || end > today))) {
    toast('Enter valid period dates, not future dates.');return;
  }
  if (end && dateDifference(end,start) > 31) { toast('Please check the end date.'); return; }
  const existing = store.cosmos.periods.find(p => p.start === start);
  if (existing) { existing.end = end; }
  else { store.cosmos.periods.push({id:newId(),start,end}); }
  $('period-entry-form').reset();
  persist();toast('Period dates saved privately on this device');
}
function removePeriod(id) {
  const selected = store.cosmos.periods.find(p => p.id === id);
  if (!selected || !confirm(`Delete the period starting ${shortDate(selected.start)}?`)) return;
  store.cosmos.periods = store.cosmos.periods.filter(p=>p.id !== id);
  persist();toast('Period entry removed');
}
function latestPeriods() {
  return store.cosmos.periods.filter(p=>isoIsValid(p.start)).slice().sort((a,b)=>a.start.localeCompare(b.start));
}
function cycleStats() {
  const periods = latestPeriods();
  const starts = periods.map(p=>p.start);
  const measured = [];
  for(let i=1;i<starts.length;i++) {
    const days = dateDifference(starts[i],starts[i-1]);
    if (days>=15 && days<=90) measured.push(days);
  }
  const recent = measured.slice(-6);
  const avg = recent.length ? Math.round(recent.reduce((s,n)=>s+n,0)/recent.length) : null;
  const fallback = Math.max(15,Math.min(90,Number(store.cosmos.cycleLength)||28));
  const cycleLength = avg || fallback;
  const last = periods.at(-1);
  let estimate = null;
  if (last && dateDifference(localISO(),last.start) <= 2*cycleLength+15) {
    estimate=addDaysISO(last.start,cycleLength);
    const today=localISO();
    // Show the next window if this estimate is already more than 10 days past.
    if (estimate < addDaysISO(today,-10)) estimate=addDaysISO(estimate,cycleLength);
  }
  return {periods,avg,cycleLength,estimate,hasMeasured:recent.length>0};
}
function dateDuringLoggedPeriod(date, periods) {
  return periods.some(p => date>=p.start && date<= (p.end||addDaysISO(p.start,Math.max(1,Math.min(20,Number(store.cosmos.periodLength)||5))-1)));
}
function renderCycleSummary() {
  const stats=cycleStats();
  const mostRecent=stats.periods.at(-1);
  const first= mostRecent ? `Last started ${shortDate(mostRecent.start)}` : 'Log a period to begin';
  const next=stats.estimate?`${shortDate(stats.estimate)}`:'Not enough recent information';
  $('cycle-summary').innerHTML = `<div class="cycle-metric"><strong>${esc(stats.avg?`${stats.avg} days`:`${stats.cycleLength} days`)}</strong><small>${stats.avg?'Average between logged periods':'Starting cycle-length estimate'}<br>${esc(first)}</small></div><div class="cycle-metric"><strong>${esc(next)}</strong><small>${stats.estimate ? 'Estimated next start, not a guarantee' : 'Estimated next period'}${stats.hasMeasured?' · based on recent starts':''}</small></div>`;
  $('period-history').innerHTML = stats.periods.length ? stats.periods.slice().reverse().map(p=>`<article class="period-history-item"><div><strong>${esc(shortDate(p.start))}</strong><small>${p.end?`Last day: ${esc(shortDate(p.end))}`:'End date not recorded'}</small></div><button type="button" data-action="cycle-delete-period" data-id="${esc(p.id)}" aria-label="Delete period starting ${esc(p.start)}">Delete</button></article>`).join('') : '<p class="empty-cosmos">Your period dates will appear here. There is no need to log anything you would rather keep private.</p>';
}
function renderCycleCalendar() {
  const shown = displayedCycleMonth || new Date(new Date().getFullYear(), new Date().getMonth(),1,12);
  const y=shown.getFullYear(),m=shown.getMonth();
  $('cycle-calendar-title').textContent=`${COSMOS_MONTHS[m]} ${y}`;
  const firstWeekday=(new Date(y,m,1).getDay()+6)%7;
  const nDays=new Date(y,m+1,0).getDate();
  const stats=cycleStats();
  const len=Math.max(1,Math.min(20,Number(store.cosmos.periodLength)||5));
  let cells = ['M','T','W','T','F','S','S'].map(day=>`<span class="calendar-day-label">${day}</span>`).join('');
  for(let i=0;i<firstWeekday;i++) cells+='<span aria-hidden="true"></span>';
  for(let d=1;d<=nDays;d++) {
    const date=localISO(new Date(y,m,d,12));
    const inPeriod=dateDuringLoggedPeriod(date,stats.periods);
    const estimated=stats.estimate && !inPeriod && date>=stats.estimate && date<addDaysISO(stats.estimate,len);
    const logged=!!store.cosmos.daily[date];
    const classes=[inPeriod?'is-period':'',estimated?'is-estimate':'',date===localISO()?'is-today':'',date===selectedCycleDate?'is-selected':''].filter(Boolean).join(' ');
    const label=`${d} ${COSMOS_MONTHS[m]} ${y}${inPeriod?', logged period':''}${estimated?', estimated next period':''}${logged?', daily check-in':''}`;
    cells+=`<button type="button" class="calendar-cell ${classes}" data-action="cycle-select-date" data-date="${date}" aria-label="${esc(label)}" aria-pressed="${date===selectedCycleDate}">${d}${logged?'<span class="calendar-dot"></span>':''}</button>`;
  }
  $('cycle-calendar-days').innerHTML=cells;
}
function loadCycleDay() {
  selectedCycleDate = selectedCycleDate || localISO();
  $('cycle-log-date').value=selectedCycleDate;
  const item=store.cosmos.daily[selectedCycleDate] || {};
  $('cycle-flow').value=item.flow||'';
  $('cycle-energy').value=item.energy||'';
  $('cycle-mood').value=item.mood||'';
  $('cycle-notes').value=item.notes||'';
  document.querySelectorAll('input[name="cycle-symptom"]').forEach(input=>input.checked=(item.symptoms||[]).includes(input.value));
}
function saveCycleDay(event) {
  event.preventDefault();
  const date=$('cycle-log-date').value;
  if (!isoIsValid(date) || date>localISO()) {toast('Please choose a valid date up to today.');return;}
  const item = {
    flow:$('cycle-flow').value,
    mood:$('cycle-mood').value,
    energy:$('cycle-energy').value,
    symptoms:[...document.querySelectorAll('input[name="cycle-symptom"]:checked')].map(el=>el.value),
    notes:$('cycle-notes').value.trim()
  };
  if (!item.flow && !item.energy && !item.mood && !item.symptoms.length && !item.notes) delete store.cosmos.daily[date];
  else store.cosmos.daily[date]=item;
  selectedCycleDate=date;
  displayedCycleMonth=new Date(fromISO(date).getFullYear(),fromISO(date).getMonth(),1,12);
  persist();toast('Daily cycle check-in saved');
}
function clearCycleDay() {
  const date=$('cycle-log-date').value;
  if (!store.cosmos.daily[date]) {toast('There is no saved check-in for this day.');return;}
  if (!confirm(`Clear your notes and symptoms for ${shortDate(date)}?`)) return;
  delete store.cosmos.daily[date];loadCycleDay();persist();toast('Check-in cleared');
}
function saveCycleSettings() {
  const len=Number($('cycle-length-setting').value), period=Number($('period-length-setting').value);
  if (!Number.isInteger(len)||len<15||len>90||!Number.isInteger(period)||period<1||period>20) {toast('Please enter valid cycle and period lengths.'); return;}
  store.cosmos.cycleLength=len;store.cosmos.periodLength=period;
  persist();toast('Cycle settings saved');
}
function saveSaturn(event) {
  event.preventDefault();
  const birthDate=$('saturn-birthdate').value;
  if (birthDate && (!isoIsValid(birthDate)||birthDate>localISO())) {toast('Please check your birth date.');return;}
  store.cosmos.birthDate=birthDate;
  persist();toast(birthDate?'Birth date saved locally':'Birth date cleared');
}
function renderSaturn() {
  const birth=store.cosmos.birthDate;
  if (document.activeElement !== $('saturn-birthdate')) $('saturn-birthdate').value=birth||'';
  if (!birth || !isoIsValid(birth)) {
    $('saturn-result').innerHTML='<span class="empty-cosmos">Add your date of birth to see a rough age-based window for Saturn-return reflections.</span>';
    return;
  }
  const start=fromISO(birth);start.setFullYear(start.getFullYear()+29);
  const end=fromISO(birth);end.setFullYear(end.getFullYear()+31);
  $('saturn-result').innerHTML=`<strong>Approximately ${esc(start.getFullYear())}–${esc(end.getFullYear())}</strong>Age-based reflection window: your 29th to 31st birthdays. This does not calculate Saturn's actual position in your natal chart.`;
}
function renderCosmos() {
  if (!selectedCycleDate) selectedCycleDate=localISO();
  if (!displayedCycleMonth) displayedCycleMonth=new Date(new Date().getFullYear(),new Date().getMonth(),1,12);
  renderResets();
  renderCycleSummary();renderCycleCalendar();
  if (document.activeElement !== $('cycle-length-setting')) $('cycle-length-setting').value=store.cosmos.cycleLength;
  if (document.activeElement !== $('period-length-setting')) $('period-length-setting').value=store.cosmos.periodLength;
  renderSaturn();
}
function handleCosmosClick(action,button) {
  if (action==='cycle-select-date') {
    selectedCycleDate=button.dataset.date;
    loadCycleDay();renderCycleCalendar();
    $('cycle-daily-form').scrollIntoView({block:'nearest',behavior:'smooth'});
  }
  if (action==='cycle-prev-month'||action==='cycle-next-month') {
    displayedCycleMonth=moveMonth(displayedCycleMonth,action==='cycle-prev-month'?-1:1);
    renderCycleCalendar();
  }
  if (action==='cycle-delete-period') removePeriod(button.dataset.id);
  if (action==='cycle-clear-day') clearCycleDay();
  if (action==='cycle-save-settings') saveCycleSettings();
}

document.addEventListener('DOMContentLoaded',()=>{
  $('period-start').max=localISO();$('period-end').max=localISO();
  $('cycle-log-date').max=localISO();
  $('saturn-birthdate').max=localISO();
  loadCycleDay();
  $('new-moon-reset-form').addEventListener('submit', saveReset);
  $('period-entry-form').addEventListener('submit',savePeriod);
  $('cycle-daily-form').addEventListener('submit',saveCycleDay);
  $('saturn-form').addEventListener('submit',saveSaturn);
  $('cycle-log-date').addEventListener('change',e=>{
    const value=e.target.value;
    if (!isoIsValid(value))return;
    selectedCycleDate=value;
    displayedCycleMonth=new Date(fromISO(value).getFullYear(),fromISO(value).getMonth(),1,12);
    loadCycleDay();renderCycleCalendar();
  });
});
