

function graph_set_y_axis(top_value) {
  const graph_y_axis = document.getElementById('graph_y_axis');
  graph_y_axis.innerHTML = '';
  for (let i = 4; i >= -4; i--) {
      const graph_division = document.createElement('div');
      graph_division.className = 'graph_division';
      const label = document.createElement('span');
      let graph_division_value = Math.round((i / 4) * top_value);
      if ((graph_division_value >= 1000000) || (graph_division_value <= -1000000) ) {
          graph_division_value = (graph_division_value /1000000);
          graph_division_value = graph_division_value % 1 === 0 ? graph_division_value.toString() : graph_division_value.toFixed(1).replace('.', ',');
          graph_division_value = graph_division_value.toString() + "MDP"
      }
      label.textContent = graph_division_value;
      graph_division.appendChild(label);
      const line = document.createElement('div');
      line.className = 'grid_line';
      graph_division.appendChild(line);
      graph_y_axis.appendChild(graph_division);
  }
};

function create_graph(profit_array, base_year = 2020) {
    const graph = document.getElementById("progression_graph");
    graph.innerHTML = "";
    const zero_line = document.createElement("div");
    zero_line.className = "graph_zero_line";
    graph.appendChild(zero_line);
    const max_abs = Math.max(...profit_array.map(Math.abs), 1);
    const magnitude = Math.pow(10, Math.floor(Math.log10(max_abs)));
    const top_value = Math.ceil(max_abs / magnitude) * magnitude;
    graph_set_y_axis(top_value);
    profit_array.forEach((value, index) => {
      const col = document.createElement("div");
      col.className = "bar_col";
      if (value > 0) {
          const bar = document.createElement("div");
          bar.className = "bar positive";
          bar.style.height = `${(value / top_value) * 50}%`;
          col.appendChild(bar);
      } else if (value < 0) {
          const bar = document.createElement("div");
          bar.className = "bar negative";
          bar.style.height = `${(Math.abs(value) / top_value) * 50}%`;
          col.appendChild(bar);
      }
      const label = document.createElement("div");
      label.className = "graph_index_label";
      label.textContent = base_year + index;
      col.appendChild(label);
      graph.appendChild(col);
    });
}


function onclick_calculate_button(facture, year, increase, cost) {
  const facture_value = parseInt(document.getElementById(facture).value, 10);
  const year_value = parseInt(document.getElementById(year).value, 10)+1;
  const increase_value = (parseInt(document.getElementById(increase).value, 10)) / 100;
  const cost_value = parseInt(document.getElementById(cost).value, 10);

  let profit_value = facture_value*12;
  let acumulated_profit_value = -(48*facture_value) - cost_value;
  const graph = document.getElementById('progression_graph');
  graph.innerHTML = '';
  let profit_array = [];
  let table_data = [];
  const base_year = new Date().getFullYear();
  for (let i = 0; i < year_value; i++) {
      table_data[i] = {year: i+base_year, profit: acumulated_profit_value};
      profit_array[i] = acumulated_profit_value;
      acumulated_profit_value = acumulated_profit_value + profit_value;
      profit_value = profit_value + parseInt(profit_value*increase_value);
  }
  create_graph(profit_array, base_year);
  data_table_populate_table(table_data);
  document.getElementById("bottom_section_group").style.display="flex";
}

function data_table_populate_table(data) {
    let table_body = document.querySelector("#data_table tbody");
    table_body.innerHTML = "";
    data.forEach((row) => {
        console.log("Populating table for test: " + row.test_name);
        const tr = document.createElement("tr");
        let status_style = "";
        if (row.profit > 0) {
            status_style = "table_positive";
        } else if (row.profit < 0) {
            status_style = "table_negative";
        }
        let formated_profit = row.profit
        if ((formated_profit >= 1000000) || (formated_profit <= -1000000) ) {
            formated_profit = (formated_profit /1000000);
            formated_profit = formated_profit % 1 === 0 ? formated_profit.toString() : formated_profit.toFixed(1).replace('.', ',');
            formated_profit = formated_profit.toString() + "MDP"
        }
        tr.innerHTML = `
            <td>${row.year}</td>
            <td class="${status_style}">${formated_profit}</td>
        `;
        table_body.appendChild(tr);
    });
};

document.addEventListener('DOMContentLoaded', function() {
  const gui_buttons = document.querySelectorAll('.info_style');
  const element_ifo_display = document.getElementById('tooltip_info');
  gui_buttons.forEach(button => {
    button.addEventListener('mouseover', function(event) {
      const element_ifo = button.getAttribute('element_ifo_data');
      element_ifo_display.textContent = element_ifo;
      const element_ifo_display_position = button.getBoundingClientRect();
      element_ifo_display.style.top =
          `${element_ifo_display_position.bottom}px`;
      element_ifo_display.style.left = `${element_ifo_display_position.left}px`;
      element_ifo_display.style.display = 'block';
    });
    button.addEventListener('mouseleave', function() {
      element_ifo_display.style.display = 'none';
    });
  });
  document.addEventListener('mouseout', function(event) {
    if (!event.relatedTarget || event.relatedTarget.nodeName === 'HTML') {
      element_ifo_display.style.display = 'none';
    }
  });
  gui_buttons.forEach(button => {
    button.addEventListener('touchstart', function(event) {
      const element_ifo = button.getAttribute('element_ifo_data');
      element_ifo_display.textContent = element_ifo;
      const element_ifo_display_position = button.getBoundingClientRect();
      element_ifo_display.style.top =
          `${element_ifo_display_position.bottom}px`;
      element_ifo_display.style.left = `${element_ifo_display_position.left}px`;
      element_ifo_display.style.display = 'block';
    });
    button.addEventListener('touchcancel ', function() {
      element_ifo_display.style.display = 'none';
    });
    document.addEventListener('touchend', function(event) {
    if (!event.relatedTarget || event.relatedTarget.nodeName === 'HTML') {
      element_ifo_display.style.display = 'none';
    }
  });
  });
});