/* ================================================
   SOLARPROPHET — systemconfig.js

   This file does 4 things:
   1. Panel type selection
   2. Capacity slider updates the live preview
   3. Tilt angle input updates the diagram
   4. Orientation dropdown rotates the compass needle
================================================ */


/* ------------------------------------------------
   THING 1: PANEL TYPE SELECTION

   When you click a panel option it becomes
   selected (orange border + checkmark) and
   the others go back to unselected.
   The live preview also updates.
------------------------------------------------ */
function selectPanel(clickedPanel) {

  /* Remove selected from all panels */
  document.querySelectorAll('.panel-option').forEach(function(panel) {
    panel.classList.remove('selected');
    /* Remove the checkmark div if it exists */
    const check = panel.querySelector('.panel-check');
    if (check) check.remove();
  });

  /* Add selected to the clicked panel */
  clickedPanel.classList.add('selected');

  /* Add checkmark to the clicked panel */
  const check = document.createElement('div');
  check.className = 'panel-check';
  check.innerHTML = '<i class="fa-solid fa-check"></i>';
  clickedPanel.appendChild(check);

  /* Update the live preview suggestion */
  const panelName = clickedPanel.querySelector('.panel-name').textContent;
  updateSuggestion(panelName);
}


/* ------------------------------------------------
   THING 2: CAPACITY SLIDER

   When you drag the slider the value shown
   at the top right updates and the preview
   card updates too.
------------------------------------------------ */
function updateCapacity(value) {
  const rounded = parseFloat(value).toFixed(1);

  /* Update the "5.0 kW" display */
  document.getElementById('capacityValue').innerHTML = rounded + ' <em>kW</em>';

  /* Update the preview sub text */
  const tilt = document.getElementById('tiltInput').value;
  document.getElementById('previewSub').textContent =
    'expected · ' + rounded + ' kW system at ' + tilt + '° tilt';

  /* Update slider track fill — shows orange up to the thumb position */
  const slider = document.getElementById('capacitySlider');
  const min = parseFloat(slider.min);
  const max = parseFloat(slider.max);
  const percent = ((value - min) / (max - min)) * 100;
  slider.style.background =
    'linear-gradient(to right, #C45E20 0%, #C45E20 ' + percent + '%, #EFE0CB ' + percent + '%, #EFE0CB 100%)';

  /* Update the "your config" value in comparison */
  const newOutput = (20 + parseFloat(value) * 1.68).toFixed(1);
  document.getElementById('previewNumber').textContent = newOutput;
  document.getElementById('yourConfigVal').textContent = newOutput + ' kWh';

  /* Update vs default difference */
  const diff = (newOutput - 25.2).toFixed(1);
  const sign = diff >= 0 ? '+' : '';
  document.getElementById('vsDiff').textContent = sign + diff + ' kWh vs. default config';
}


/* ------------------------------------------------
   THING 3: TILT ANGLE INPUT

   When you type a tilt angle the diagram
   line rotates to show the new angle and
   the preview sub text updates.
------------------------------------------------ */
function updateTilt(value) {
  const angle = Math.min(Math.max(parseInt(value) || 0, 0), 90);

  /* Update the label inside the SVG */
  document.getElementById('tiltLabel').textContent = angle + '°';

  /* 
    Rotate the panel line in the SVG diagram.
    The line goes from point (15,50) and we
    calculate where the top should be based
    on the angle.
  */
  const radians = (angle * Math.PI) / 180;
  const length  = 45;
  const x2 = 15 + length * Math.cos(radians);
  const y2 = 50 - length * Math.sin(radians);
  document.getElementById('tiltLine').setAttribute('x2', x2.toFixed(1));
  document.getElementById('tiltLine').setAttribute('y2', y2.toFixed(1));

  /* Update the preview sub text */
  const capacity = document.getElementById('capacitySlider').value;
  document.getElementById('previewSub').textContent =
    'expected · ' + parseFloat(capacity).toFixed(1) + ' kW system at ' + angle + '° tilt';
}


/* ------------------------------------------------
   THING 4: ORIENTATION DROPDOWN

   When you select a direction the compass
   needle rotates to point that way.
------------------------------------------------ */
function updateOrientation(direction) {

  /* Degrees to rotate the needle for each direction */
  const angles = {
    north: 180,   /* needle points up = north */
    south: 0,     /* needle points down = south */
    east:  270,   /* needle points right = east */
    west:  90     /* needle points left = west */
  };

  const angle = angles[direction] || 0;

  /* Rotate the needle line using CSS transform */
  const needle = document.getElementById('compassNeedle');
  needle.style.transformOrigin = '40px 40px';  /* rotate around center */
  needle.style.transform = 'rotate(' + angle + 'deg)';
  needle.style.transition = 'transform 0.4s ease';
}


/* ------------------------------------------------
   UPDATE SUGGESTION TEXT
   Changes based on which panel type is selected
------------------------------------------------ */
function updateSuggestion(panelName) {
  const suggestions = {
    'Monocrystalline': 'Increasing tilt to 7° matches Ejisu\'s latitude and could yield an extra 0.3 kWh/day. Try the slider →',
    'Polycrystalline':  'Monocrystalline panels could boost output by ~5%. Consider upgrading for higher daily yield.',
    'Thin film':        'Thin film works well in diffuse light. Consider increasing system capacity to compensate for lower efficiency.'
  };

  document.getElementById('suggestionText').textContent =
    suggestions[panelName] || suggestions['Monocrystalline'];
}


/* ------------------------------------------------
   ANIMATE BARS ON LOAD
   The comparison bars grow from 0 to full width
------------------------------------------------ */
const bars = document.querySelectorAll('.bar');

bars.forEach(function(bar) {
  bar.dataset.target = bar.style.getPropertyValue('--w');
  bar.style.setProperty('--w', '0%');
});

window.addEventListener('load', function() {
  bars.forEach(function(bar, index) {
    setTimeout(function() {
      bar.style.setProperty('--w', bar.dataset.target);
    }, 200 + index * 150);
  });
});
