var panelHr = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
var lightHr = [0, 1, 2, 3, 4, 5, 16, 17, 18, 19, 20, 21, 22, 23];
var ledHr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

document.addEventListener('DOMContentLoaded', function() {
    const containersHr = document.querySelectorAll('fieldset[id*="-hr"]');
    containersHr.forEach(container => {
        if (container.id == 'ei-hr') {
            var valueList = [0.522282976, 0.526855012, 0.528978982, 0.529213821, 0.529165957, 0.527616538, 0.5211079, 0.507797544, 0.489671161, 0.477437139, 0.468892276, 0.464295846, 0.468425788, 0.467460745, 0.472725429, 0.48284651, 0.494744217, 0.506920251, 0.509346339, 0.510050185, 0.510802634, 0.510964992, 0.512559266, 0.517206802];
            var nameId = 'ei-hr';

            for (let i = 0; i < 24; i++) {
                container.innerHTML += `<label>${i}時：<input type="number" name="${nameId}-${i}" value="${valueList[i]}"></label>`;
            };
        } else {
            if (container.id == 'panel-hr') {
                var isCheckedList = panelHr;
                var nameId = 'panel-hr';
            } else if (container.id == 'light-hr') {
                var isCheckedList = lightHr;
                var nameId = 'light-hr';
            } else if (container.id == 'led-hr') {
                var isCheckedList = ledHr;
                var nameId = 'led-hr';
            };

            for (let i = 0; i < 24; i++) {
                let isChecked = isCheckedList.includes(i) ? 'checked' : ''; // 判断是否需要预设选中
                container.innerHTML += `<label><input type="checkbox" name="${nameId}-${i}" value="${i}" ${isChecked}>${i}時</label>`;
            }
        };

        let isSelecting = false;
        let selectionMode = null; // null, 'selecting', or 'deselecting'

        container.addEventListener('mousedown', function(e) {
            if (e.target.children[0].type === 'checkbox') {
                selectionMode = e.target.children[0].checked ? 'deselecting' : 'selecting';
                isSelecting = true;
                e.target.children[0].checked = selectionMode === 'selecting';
                e.preventDefault();
            };
        });
    
        container.addEventListener('mouseover', function(e) {
            if (isSelecting && e.target.children[0].type === 'checkbox') {
                e.target.children[0].checked = selectionMode === 'selecting';
            };
        });
    
        document.addEventListener('mouseup', function(e) {
            e.target.children[0].checked = true;
            isSelecting = false;
            selectionMode = null;
        });
    });

    const containersMonth = document.querySelectorAll('fieldset[id*="-month"]');
    containersMonth.forEach(container => {
        if (container.id == 'cf-month') {
            var valueList = [0.0951, 0.1346, 0.1205, 0.1412, 0.1566, 0.1517, 0.171, 0.1527, 0.1791, 0.1165, 0.0749, 0.073];
            var nameId = 'cf-month';
        };

        for (let i = 1; i <= 12; i++) {
            container.innerHTML += `<label>${i}月: <input type="number" name="${nameId}-${i}" value="${valueList[i-1]}"></label>`;
        }
    });

});

const roundTo = function( num, decimal ) { return Math.round( ( num + Number.EPSILON ) * Math.pow( 10, decimal ) ) / Math.pow( 10, decimal ); }

function countDays(year, month) {
    let workdays = 0;
    let weekends = 0;

    // 创建指定月份的第一天和最后一天的日期对象
    const startDate = new Date(year, month - 1, 1);  // JavaScript中月份是从0开始的
    const endDate = new Date(year, month, 0);  // 设置为下个月的第0天，即这个月的最后一天

    // 遍历这个月的每一天
    for (let day = startDate; day <= endDate; day.setDate(day.getDate() + 1)) {
        const dayOfWeek = day.getDay();
        // getDay() 返回星期几，0是星期天，6是星期六
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            weekends++;
        } else {
            workdays++;
        }
    }

    return [workdays, weekends];
};

function nper (rate, pmt, pv, fv=0, when='end') {
    // 定义最大迭代次数和容忍度
    const maxIterations = 1000;
    const tolerance = 1e-6;
  
    // 当付款在期初发生时，when = 1，否则 when = 0
    when = when === 'start' ? 1 : 0;
    
    // 估算一个初值
    let nperGuess = 10;
    let f;
    let df;
    
    for (let i = 0; i < maxIterations; i++) {
      // 当期的函数值
        f = fv + pv * Math.pow(1 + rate, nperGuess) + pmt * (1 + rate * when) / rate * (Math.pow(1 + rate, nperGuess) - 1);
        
        // 当期的导数值
        df = pv * Math.pow(1 + rate, nperGuess) * Math.log(1 + rate) + pmt * (1 + rate * when) / rate * Math.pow(1 + rate, nperGuess) * Math.log(1 + rate);
    
        // 更新 nper 的估算值
        let nperNew = nperGuess - f / df;
        
        // 检查收敛性
        if (Math.abs(nperNew - nperGuess) < tolerance) {
            return nperNew;
        }
    
        nperGuess = nperNew;
    }

    console.log('Number of periods (nper) did not converge. Try different initial guesses or check your input values.');
  
    // throw new Error('Number of periods (nper) did not converge. Try different initial guesses or check your input values.');
}

function pv (rate, nper, pmt, fv=0, when='end') {
    // 当付款在期初发生时，when = 1，否则 when = 0
    when = when === 'start' ? 1 : 0;
    
    // 计算现值
    let pv = -fv / Math.pow(1 + rate, nper);
    for (let i = 1; i <= nper; i++) {
        pv += pmt / Math.pow(1 + rate, i - when);
    }
    
    return pv;
}

// calculattion

// var installedCapacity = 6.3;
// var initialCostPerKW = 50000;
// var initialCost = initialCostPerKW * installedCapacity;
// var discountRate = 0.03;
// var epIncrease = 0;
// var carbonTaxUse = true;
// var carbonTax = 300;
// var fitUse = true;
// var fitYr = 20;
// var fitPrice = 5.7848;
var initialCost = parseFloat(document.querySelector('#initial-cost').value);
var discountRate = parseFloat(document.querySelector('#discount-rate').value)/100;
var epIncrease = parseFloat(document.querySelector('#ep-increase').value)/100;
var carbonTaxUse = document.querySelector('input[name="carbon-tax-use"]').checked;
var carbonTax = parseFloat(document.querySelector('input[name="carbon-tax-rate"]').value);
var fitUse = document.querySelector('input[name="fit-use"]').checked;
var fitYr = parseFloat(document.querySelector('input[name="fit-yr"]').value);
var fitPrice = parseFloat(document.querySelector('input[name="fit-rate"]').value);
var installedCapacity = parseFloat(document.querySelector('#installed-capacity').value);
var cfMonth = [0.0951, 0.1346, 0.1205, 0.1412, 0.1566, 0.1517, 0.171, 0.1527, 0.1791, 0.1165, 0.0749, 0.073];
var eiHr = [0.522282976, 0.526855012, 0.528978982, 0.529213821, 0.529165957, 0.527616538, 0.5211079, 0.507797544, 0.489671161, 0.477437139, 0.468892276, 0.464295846, 0.468425788, 0.467460745, 0.472725429, 0.48284651, 0.494744217, 0.506920251, 0.509346339, 0.510050185, 0.510802634, 0.510964992, 0.512559266, 0.517206802];

var panelNum = document.querySelector('input[name="panel-num"]').value;
var panelKw = document.querySelector('input[name="panel-kw"]').value;
var lightNum = document.querySelector('input[name="light-num"]').value;
var lightKw = document.querySelector('input[name="light-kw"]').value;
var ledNum = document.querySelector('input[name="led-num"]').value;
var ledKw = document.querySelector('input[name="led-kw"]').value;

var use1D = [];
for (let i=0; i<24; i++) {
    let panelUse = panelHr.includes(i) ? panelNum * panelKw : 0;
    let lightUse = lightHr.includes(i) ? lightNum * lightKw : 0;
    let ledUse = ledHr.includes(i) ? ledNum * ledKw : 0;
    use1D.push(panelUse + lightUse + ledUse);
}


// 夏月 6, 7, 8, 9
const sumMonth = [5, 6, 7, 8];

const ep2SumWeek = [1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 4.71, 4.71, 4.71, 4.71, 4.71, 4.71, 4.71, 4.71, 4.71, 4.71, 4.71, 4.71, 4.71, 4.71, 4.71];
const ep2SumWeekend = [1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85];

const ep2NonsumWeek = [1.78, 1.78, 1.78, 1.78, 1.78, 1.78, 4.48, 4.48, 4.48, 4.48, 4.48, 1.78, 1.78, 1.78, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48];
const ep2NonsumWeekend = [1.78, 1.78, 1.78, 1.78, 1.78, 1.78, 1.78, 1.78, 1.78, 1.78, 1.78, 1.78, 1.78, 1.78, 1.78, 1.78, 1.78, 1.78, 1.78, 1.78, 1.78, 1.78, 1.78, 1.78];

const ep3SumWeek = [1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 4.26, 4.26, 4.26, 4.26, 4.26, 4.26, 4.26, 6.49, 6.49, 6.49, 6.49, 6.49, 6.49, 4.26, 4.26];
const ep3SumWeekend = [1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85];

const ep3NonsumWeek = [1.78, 1.78, 1.78, 1.78, 1.78, 1.78, 4.06, 4.06, 4.06, 4.06, 4.06, 1.78, 1.78, 1.78, 4.06, 4.06, 4.06, 4.06, 4.06, 4.06, 4.06, 4.06, 4.06, 4.06];
const ep3NonsumWeekend = [1.78, 1.78, 1.78, 1.78, 1.78, 1.78, 1.78, 1.78, 1.78, 1.78, 1.78, 1.78, 1.78, 1.78, 1.78, 1.78, 1.78, 1.78, 1.78, 1.78, 1.78, 1.78, 1.78, 1.78];

const npvMaxYear = 100;

function calculate(initialCost, discountRate, epIncrease, carbonTaxUse, carbonTax, fitUse, fitYr, fitPrice, installedCapacity, cfMonth, eiHr, use1D) {
    carbonTax = carbonTaxUse ? carbonTax : 0;
    fitYr = fitUse ? fitYr : 0;
    fitPrice = fitUse ? fitPrice : 0;

    let feeOriginal = 0;
    let feeWithPVPromised = 0;
    let feeWithPVPromisedAfter = 0;
    let emissionOriginal = 0;
    let emissionWithPVPromised = 0;
    let emissionWithPVPromisedAfter = 0;

    // var use1D = [0.68733333, 0.70044872, 0.65696154, 0.66737179, 0.65816667, 0.5065    , 0.38942308, 0.52894872, 0.69639744, 0.84197436, 0.90815385, 0.96782051, 0.89358974, 0.788     , 0.60758974, 0.44853846, 0.47041026, 0.87008974, 1.12184615, 1.11785897, 1.14437179, 1.12679487, 1.07080769, 0.90544872];
    var gen1Y = [];
    const gen1DRatio = [0, 0, 0, 0, 0, 0.00075863, 0.01216213, 0.04136537, 0.0729176, 0.09983097, 0.11844631, 0.12865829, 0.13157492, 0.12365712, 0.10745313, 0.08356283, 0.05340638, 0.02271813, 0.00348821, 0, 0, 0, 0, 0];

    for (let m=0; m<12; m++) {
        var gen1D = []
        for (let h=0; h<24; h++) {
            gen1D.push(gen1DRatio[h] * installedCapacity * cfMonth[m] * 24);
        }
        gen1Y.push(gen1D);
    };

    for (let m=0; m<12; m++) {
        var gen1D = gen1Y[m];
        var electricityPriceList = sumMonth.includes(m) ? [ep2SumWeek, ep2SumWeekend] : [ep2NonsumWeek, ep2NonsumWeekend];

        var feeOriginalTemp = 0;
        var feeWithPVPromisedTemp = 0;
        var feeWithPVPromisedAfterTemp = 0;
        var emissionOriginalTemp = 0;
        var emissionWithPVPromisedTemp = 0;
        var emissionWithPVPromisedAfterTemp = 0;

        for (let p=0; p<2; p++){
            for (let h=0; h<24; h++) {
                let netGen = gen1D[h] - use1D[h];
                let genSum = Math.max(0, netGen);
                let netGenOnlyUse = Math.min(0, netGen);

                feeOriginalTemp += use1D[h] * electricityPriceList[p][h] * (1 + epIncrease);
                feeWithPVPromisedTemp += Math.abs(netGenOnlyUse) * electricityPriceList[p][h] * (1 + epIncrease) - genSum * fitPrice;
                feeWithPVPromisedAfterTemp += -netGen * electricityPriceList[p][h] * (1 + epIncrease);

                emissionOriginalTemp += use1D[h] * eiHr[h];
                emissionWithPVPromisedTemp += -netGen * eiHr[h];
                emissionWithPVPromisedAfterTemp += -netGen * eiHr[h];
            };

            feeOriginal += feeOriginalTemp * countDays(2023, m+1)[p];
            feeWithPVPromised += feeWithPVPromisedTemp * countDays(2023, m+1)[p];
            feeWithPVPromisedAfter += feeWithPVPromisedAfterTemp * countDays(2023, m+1)[p];
            emissionOriginal += emissionOriginalTemp * countDays(2023, m+1)[p];
            emissionWithPVPromised += emissionWithPVPromisedTemp * countDays(2023, m+1)[p];
            emissionWithPVPromisedAfter += emissionWithPVPromisedAfterTemp * countDays(2023, m+1)[p];
        };
    };

    var feeOriginalEmission = emissionOriginal * carbonTax / 1000;
    var feeWithPVPromisedEmission = emissionWithPVPromised * carbonTax / 1000;
    var feeWithPVPromisedAfterEmission = emissionWithPVPromisedAfter * carbonTax / 1000;

    var annualSaving = feeOriginal + feeOriginalEmission - feeWithPVPromised - feeWithPVPromisedEmission;
    var annualSavingAfter = feeOriginal + feeOriginalEmission - feeWithPVPromisedAfter - feeWithPVPromisedAfterEmission;

    let npvCurve = [{ year: 0, npv: -initialCost }];
    let npv = -initialCost;
    let year = 1;
    let overPromised = false;
    let breakevenPoint;

    while (npv < 0 && year < npvMaxYear) {
        if (year < fitYr+1) {
            npv += annualSaving / Math.pow(1 + discountRate, year);
        } else {
            npv += annualSavingAfter / Math.pow(1 + discountRate, year);
            overPromised = true;
        };
        npvCurve.push({ year: year, npv: npv });
        year += 1;
    };
    
    if (overPromised) {
        let p = (initialCost - pv(discountRate, fitYr, annualSaving)) * Math.pow(1 + discountRate, fitYr);
        breakevenPoint = fitYr + nper(discountRate, -annualSavingAfter, p);
    } else {
        breakevenPoint = nper(discountRate, -annualSaving, initialCost);
    };
    
    if (year >= npvMaxYear) {
        breakevenPoint = '無法回本';
    };

    return {npvCurve, breakevenPoint, annualSaving, annualSavingAfter};
};

var {npvCurve, breakevenPoint, annualSaving, annualSavingAfter} = calculate(initialCost, discountRate, epIncrease, carbonTaxUse, carbonTax, fitUse, fitYr, fitPrice, installedCapacity, cfMonth, eiHr, use1D);

const annualSavingP = document.querySelector('#annual-saving');
const annualSavingAfterP = document.querySelector('#annual-saving-after');
const breakevenPointP = document.querySelector('#breakeven-yr');

annualSavingP.textContent = `${roundTo(annualSaving, 1)}元`;
annualSavingAfterP.textContent = `${roundTo(annualSavingAfter, 1)}元`;
breakevenPointP.textContent = `${roundTo(breakevenPoint, 2)}年`;

const width = 960, height = 500;
const margin = {top: 20, right: 45, bottom: 40, left: 65};

var xMax = npvCurve[npvCurve.length - 1].year * 1.1;
var yMax = initialCost * 0.1;

const x = d3.scaleLinear()
    .domain([0, xMax])
    .range([margin.left, width - margin.right]);

const y = d3.scaleLinear()
    .domain([d3.min(npvCurve, d => d.npv), yMax])
    .range([height - margin.bottom, margin.top]);

// Declare the line generator.
var drawCurve = d3.line()
    .x(d => x(d.year))
    .y(d => y(d.npv));

const breakevenPlot = d3.select("#breakeven-plot").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

const gx = breakevenPlot.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickFormat(d => d + "年"));

const gxTop = breakevenPlot.append("g")
    .attr("transform", `translate(0,${margin.top})`)
    .call(d3.axisTop(x).tickFormat(d => d + "年"));

const gxLabel = breakevenPlot.append("text")
    .attr("text-anchor", "middle")
    .attr("x", width/2)
    .attr("y", height)
    .text("");

const gy = breakevenPlot.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).tickFormat(d => d/1000));

const gyRight = breakevenPlot.append("g")
    .attr("transform", `translate(${width - margin.right},0)`)
    .call(d3.axisRight(y).tickFormat(d => d/1000));

const gyLabel = breakevenPlot.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("x", -height/2)
    .attr("y", 20)
    .text("淨現值 (千元)");

const svgFitYrLine = breakevenPlot.append("line")
    .attr("x1", x(fitYr))
    .attr("y1", y(y.domain()[0]))
    .attr("x2", x(fitYr))
    .attr("y2", y(y.domain()[1]))
    .attr("stroke", "black")
    .attr("stroke-dasharray", "5,5");

const svgBaseLine = breakevenPlot.append("line")
    .attr("x1", x(x.domain()[0]))
    .attr("y1", y(0))
    .attr("x2", x(x.domain()[1]))
    .attr("y2", y(0))
    .attr("stroke", "black")
    .attr("stroke-dasharray", "5,5");

const svgCurve = breakevenPlot.append("path")
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 2)
    .attr("d", drawCurve(npvCurve));

const svgBreakevenLine = breakevenPlot.append("line")
    .attr("x1", x(breakevenPoint))
    .attr("y1", y(y.domain()[0]))
    .attr("x2", x(breakevenPoint))
    .attr("y2", y(y.domain()[1]))
    .attr("stroke", "black")
    .attr("stroke-dasharray", "5,5");

const svgBreakevenText = breakevenPlot.append("text")
    .attr("x", x(breakevenPoint) + 5)
    .attr("y", y(0) + 20)
    .attr("style", "font-size: 1rem;")
    .text(`${roundTo(breakevenPoint, 2)}年`);

// update
const durationTime = 1000;
function update() {
    var initialCost = parseFloat(document.querySelector('#initial-cost').value);
    var discountRate = parseFloat(document.querySelector('#discount-rate').value)/100;
    var epIncrease = parseFloat(document.querySelector('#ep-increase').value)/100;
    var carbonTaxUse = document.querySelector('input[name="carbon-tax-use"]').checked;
    var carbonTax = parseFloat(document.querySelector('input[name="carbon-tax-rate"]').value);
    var fitUse = document.querySelector('input[name="fit-use"]').checked;
    var fitYr = parseFloat(document.querySelector('input[name="fit-yr"]').value);
    var fitPrice = parseFloat(document.querySelector('input[name="fit-rate"]').value);
    var installedCapacity = parseFloat(document.querySelector('#installed-capacity').value);
    var cfMonth = [];
    let cfMonthInputs = document.querySelectorAll('#cf-month input[type="number"]');
    cfMonthInputs.forEach(input => {cfMonth.push(parseFloat(input.value));});
    var eiHr = [];
    let eiHrInputs = document.querySelectorAll('#ei-hr input[type="number"]');
    eiHrInputs.forEach(input => {eiHr.push(parseFloat(input.value));});

    var panelNum = document.querySelector('input[name="panel-num"]').value;
    var panelKw = document.querySelector('input[name="panel-kw"]').value;
    var panelHr = document.querySelectorAll('input[name*="panel-hr"]');
    panelHr = Array.from(panelHr).filter(input => input.checked).map(input => parseInt(input.value));
    var lightNum = document.querySelector('input[name="light-num"]').value;
    var lightKw = document.querySelector('input[name="light-kw"]').value;
    var lightHr = document.querySelectorAll('input[name*="light-hr"]');
    lightHr = Array.from(lightHr).filter(input => input.checked).map(input => parseInt(input.value));
    var ledNum = document.querySelector('input[name="led-num"]').value;
    var ledKw = document.querySelector('input[name="led-kw"]').value;
    var ledHr = document.querySelectorAll('input[name*="led-hr"]');
    ledHr = Array.from(ledHr).filter(input => input.checked).map(input => parseInt(input.value));

    var use1D = [];
    for (let i=0; i<24; i++) {
        let panelUse = panelHr.includes(i) ? panelNum * panelKw : 0;
        let lightUse = lightHr.includes(i) ? lightNum * lightKw : 0;
        let ledUse = ledHr.includes(i) ? ledNum * ledKw : 0;
        use1D.push(panelUse + lightUse + ledUse);
    }

    var {npvCurve, breakevenPoint, annualSaving, annualSavingAfter} = calculate(initialCost, discountRate, epIncrease, carbonTaxUse, carbonTax, fitUse, fitYr, fitPrice, installedCapacity, cfMonth, eiHr, use1D);

    annualSavingP.textContent = `${roundTo(annualSaving, 1)}元`;
    annualSavingAfterP.textContent = `${roundTo(annualSavingAfter, 1)}元`;

    breakevenPointP.textContent = typeof breakevenPoint == 'number' ? `${roundTo(breakevenPoint, 2)}年` : breakevenPoint;

    xMax = npvCurve[npvCurve.length - 1].year * 1.1;
    yMax = typeof breakevenPoint == 'number' ? initialCost * 0.1 : 0;
    x.domain([0, xMax]);
    y.domain([d3.min(npvCurve, d => d.npv), yMax]);

    gx.transition()
        .duration(durationTime)
        .call(d3.axisBottom(x).tickFormat(d => d + "年"));

    gxTop.transition()
        .duration(durationTime)
        .call(d3.axisTop(x).tickFormat(d => d + "年"));

    gy.transition()
        .duration(durationTime)
        .call(d3.axisLeft(y).tickFormat(d => d/1000));

    gyRight.transition()
        .duration(durationTime)
        .call(d3.axisRight(y).tickFormat(d => d/1000));

    if (fitUse) {
        svgFitYrLine.transition()
            .duration(durationTime)
            .attr("x1", x(fitYr))
            .attr("x2", x(fitYr));
    } else {
        svgFitYrLine.transition()
            .duration(durationTime)
            .attr("x1", x(x.domain()[0]))
            .attr("x2", x(x.domain()[0]))
            .attr("y1", y(y.domain()[0]))
            .attr("y2", y(y.domain()[0]));
    };

    svgCurve.transition()
        .duration(durationTime)
        .attr("d", drawCurve(npvCurve));

    if (typeof breakevenPoint == 'number') {
        svgBaseLine.transition()
            .duration(durationTime)
            .attr("y1", y(0))
            .attr("y2", y(0));

        svgBreakevenLine.transition()
            .duration(durationTime)
            .attr("x1", x(breakevenPoint))
            .attr("x2", x(breakevenPoint));

        svgBreakevenText.transition()
            .duration(durationTime)
            .attr("x", x(breakevenPoint) + 5)
            .attr("y", y(0) + 20)
            .text(`${roundTo(breakevenPoint, 2)}年`);
    } else {
        svgBaseLine.transition()
            .duration(durationTime)
            .attr("y1", y(0))
            .attr("y2", y(0))
            .attr("stroke", "transparent");

        svgBreakevenLine.transition()
            .duration(durationTime)
            .attr("x1", x(x.domain()[0]))
            .attr("x2", x(x.domain()[0]))
            .attr("y1", y(y.domain()[0]))
            .attr("y2", y(y.domain()[0]));

        svgBreakevenText.transition()
            .duration(durationTime)
            .attr("x", x(npvMaxYear) - 40)
            .attr("y", y(npvCurve[npvCurve.length - 1].npv) + 25)
            .text(breakevenPoint);
    };
};

// Generate the time slots
// const grid = document.getElementById('time-slot-grid');
// for (let hour = 0; hour < 24; hour++) {
//   for (let day = 0; day < 1; day++) { // Adjust the number for more days
//     const slot = document.createElement('div');
//     slot.classList.add('time-slot');
//     slot.dataset.hour = hour;
//     slot.dataset.day = day;
//     grid.appendChild(slot);
//   }
// }

// const grid = document.getElementById('ei-box');
// for (let h = 0; h < 24; h++) {
//     const label = document.createElement('label');
//     label.classList.add('time-slot');
//         label.dataset.h = h;
//         label.textContent = h + '時';

//     const checkbox = document.createElement('input');
//     checkbox.type = 'checkbox';
//     checkbox.id = 'slot-' + h;
//     checkbox.dataset.h = h;

//     label.appendChild(checkbox);

//     grid.appendChild(label);
// }

// let isSelecting = false;
// let selectionMode = null; // null, 'selecting', or 'deselecting'

// const containersHr = document.querySelectorAll('fieldset[id*="-hr"]');
// containersHr.forEach(container => {
//     container.addEventListener('mousedown', function(e) {
//         console.log(e.target);
//         if (e.target.children[0].type === 'checkbox') {
//             console.log(e.target.children);
//             selectionMode = e.target.children[1].checked ? 'deselecting' : 'selecting';
//             isSelecting = true;
//             e.target.children[0].checked = selectionMode === 'selecting';
//             e.preventDefault();
//         };
//     });

//     container.addEventListener('mouseover', function(e) {
//         if (isSelecting && e.target.children[0].type === 'checkbox') {
//             e.target.children[0].checked = selectionMode === 'selecting';
//         };
//     });

//     document.addEventListener('mouseup', function() {
//         isSelecting = false;
//         selectionMode = null;
//     });
// });
