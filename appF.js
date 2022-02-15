// variables used to get mouse position on the canvas
var $canvas = $("#zplane_polezero2");
var $canvas2 = $("#allpass_zplane_polezero2");
var canvasOffset = $canvas.offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;
var scrollX = $canvas.scrollLeft();
var scrollY = $canvas.scrollTop();

// variables to save last mouse position
// used to see how far the user dragged the mouse
// and then move the text by that distance
var startX;
var startY;
var origin_of_unit_circle = [100, 100]
var zeros = new Array;
var poles = new Array;
var zerosNum = 0;
var polesNum = 0;
var allPassNum = 0;
var a_vals = ['0.5+1i', '1+1i', '0.2+1i', '1.4+0.1i', '2+2i']
var a_to_display = []
// this var will hold the index of the selected point in zplane
var selectedPoint = -1;

var Z = new Array(100);
var freqAxis = new Array(100);

for (let i = 0; i < 100; i++) {
    Z[i] = math.complex(math.cos(math.PI * (i / 100)), math.sin(math.PI * (i / 100)));
    freqAxis[i] = Math.PI * (i / 100);
}

for (a of a_vals) {
    menu_of_all_pass = document.getElementById("menu-of-all-pass-filters");
    var select = document.createElement('option');
    select.setAttribute('value', a);
    select.innerHTML = a;
    menu_of_all_pass.appendChild(select);

}



function addNewPole() {
    // console.log("I'm here!");
    points = document.getElementById("poles");
    var div = document.createElement("div");
    div.id = 'pole' + polesNum + '_polezero2';
    points.appendChild(div);
    poles.push([0, 0]);
    polesNum = polesNum + 1;
    setZplane(poles, zeros);
    console.log("poles = " + poles);
}

function addNewZero() {
    points = document.getElementById("zeros");
    var div = document.createElement('div');
    div.id = 'zero' + zerosNum + '_polezero2';
    points.appendChild(div);
    zeros.push([0, 0]);
    zerosNum = zerosNum + 1;
    setZplane(poles, zeros);
    console.log("zeros = " + zeros);
}



function addNewAllPass(a) {
    allPass.push(math.complex(a));
    allPassNum = allPassNum + 1;
    setZplane(poles, zeros);
}

function removeAllPassFilter(a) {
    allPass = allPass.filter(function (value, index, arr) {
        return !math.equal(value, math.complex(a));
    });
    allPassNum = allPassNum - 1;
    setZplane(poles, zeros);
}

function addOrRemove(cb, a) {
    if (cb.checked) {
        addNewAllPass(a);
    }
    else {
        removeAllPassFilter(a);
    }
}

function clearAllPoints() {
    poles = [];
    zeros = [];
    polesNum = 0;
    zerosNum = 0;
    setZplane(poles, zeros);
}
function clearZeros() {
    zeros = [];
    zerosNum = 0;
    setZplane(poles, zeros);
}
function clearPoles() {
    poles = [];
    polesNum = 0;
    setZplane(poles, zeros);
}




// test if x,y is inside the bounding box of texts[textIndex]
function pointHittest(x, y, textIndex) {
    // console.log([x, y]);
    console.log("poles.length is " + poles.length);
    if (textIndex >= polesNum) {
        console.log("check some zero!");
        return (x >= zeros[textIndex - polesNum][0] - 0.2 && x <= zeros[textIndex - polesNum][0] + 0.2 && y >= zeros[textIndex - polesNum][1] - 0.2 && y <= zeros[textIndex - polesNum][1] + 0.2);
    }
    if (textIndex < polesNum) {
        console.log("check some pole!");
        return (x >= poles[textIndex][0] - 0.05 && x <= poles[textIndex][0] + 0.05 && y >= poles[textIndex][1] - 0.05 && y <= poles[textIndex][1] + 0.05);
    }
}

// handle mousedown events
// iterate through texts[] and see if the user
// mousedown'ed on one of them
// If yes, set the selectedText to the index of that text
function handleMouseDown(e) {
    e.preventDefault();
    startX = parseInt(e.clientX - offsetX);
    startY = parseInt(e.clientY - offsetY);
    console.log("you selected point [" + startX + ", " + startY + "]");
    console.log("which is point [" + (startX - 150) / 100 + ", " + -(startY - 150) / 100 + "]");

    // console.log("poles number is " + poles.length);
    // console.log("zeros number is " + zeros.length);
    totalLength = polesNum + zerosNum;
    // totalLength = 1000;
    // Put your mousedown stuff here
    for (var i = 0; i < totalLength; i++) {
        if (pointHittest((startX - 150) / 100, -(startY - 150) / 100, i)) {
            selectedPoint = i;
            if (i >= polesNum) {
                console.log("selected zero" + (i - polesNum));
            } else if (i < polesNum) {
                console.log("selected pole" + (i));
            }
        }
        // selectedPoint = i;
        //     if(i >= polesNum){
        //         console.log("selected zero" + (i - polesNum));
        //     }else if(i < polesNum){
        //         console.log("selected pole" + (i));
        //     }

    }
}

// handle mousemove events
// calc how far the mouse has been dragged since
// the last mousemove event and move the selected text
// by that distance
function handleMouseMove(e) {
    if (selectedPoint < 0) {
        return;
    }
    console.log("Mouse is Moving!...");
    e.preventDefault();
    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY);

    // Put your mousemove stuff here
    var dx = (mouseX - startX) / 100;
    var dy = -(mouseY - startY) / 100;
    console.log("MouseXY -> [" + mouseX + ", " + mouseY + "]");
    console.log("MouseXY -> [" + startX + ", " + startY + "]");
    startX = mouseX;
    startY = mouseY;
    // console.log("moved to point [" + startX + ", " + startY + "]");
    // console.log("which is point [" + (startX+70)/100 + ", " + -(startY-150)/100 + "]");  
    // console.log("moved by [" + dx + ", " + dy + "]");  

    if (selectedPoint >= poles.length) {
        zeros[selectedPoint - poles.length][0] += dx;
        zeros[selectedPoint - poles.length][1] += dy;
    } else if (selectedPoint < poles.length) {
        poles[selectedPoint][0] += dx;
        poles[selectedPoint][1] += dy;
    }
    // addNewPole([dx, dy]);
    setZplane(poles, zeros);
}

// done dragging
function handleMouseUp(e) {
    e.preventDefault();
    selectedPoint = -1;
}

// also done dragging
function handleMouseOut(e) {
    e.preventDefault();
    selectedPoint = -1;
}

// clicked pole or zero -> delete it
function handleMouseClick(e) {
    // e.preventDefault();
    startX = parseInt(e.clientX - offsetX);
    startY = parseInt(e.clientY - offsetY);
    console.log("you selected point [" + startX + ", " + startY + "]");
    console.log("which is point [" + (startX - 150) / 100 + ", " + -(startY - 150) / 100 + "]");

    // console.log("poles number is " + poles.length);
    // console.log("zeros number is " + zeros.length);
    totalLength = polesNum + zerosNum;
    // Put your mousedown stuff here
    for (var i = 0; i < totalLength; i++) {
        if (pointHittest((startX - 150) / 100, -(startY - 150) / 100, i)) {
            if (i >= polesNum) {
                zeros.splice(i - polesNum, 1);
                zerosNum = zerosNum - 1;
                console.log("selected zero" + (i - polesNum));
            } else if (i < polesNum) {
                poles.splice(i, 1);
                polesNum = polesNum - 1;
                console.log("selected pole" + (i));
            }
        }


    }
    setZplane(poles, zeros);
}

// listen for mouse events
$("#zplane_polezero2").mousedown(function (e) {
    handleMouseDown(e);
});
$("#zplane_polezero2").mousemove(function (e) {
    handleMouseMove(e);
});
$("#zplane_polezero2").mouseup(function (e) {
    handleMouseUp(e);
});
$("#zplane_polezero2").mouseout(function (e) {
    handleMouseOut(e);
});
$("#zplane_polezero2").dblclick(function (e) {
    handleMouseClick(e);
});

function setZplane(poles, zeros) {

    console.log("drawing..");
    console.log("poles number is " + poles.length);
    console.log("zeros number is " + zeros.length);

    var radius = 100;	// radius of unit circle
    var pSize = 4;		// size of pole and zero graphic
    var zSize = 4;

    var c = document.getElementById("zplane_polezero2");
    var ctx = c.getContext("2d");

    ctx.clearRect(0, 0, c.width, c.height);

    var pad = (c.width - 2 * radius) / 2; // padding on each side

    // unit circle
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.arc(radius + pad, radius + pad, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // y axis
    ctx.beginPath();
    //ctx.lineWidth="1";
    ctx.strokeStyle = "lightgray";
    ctx.moveTo(radius + pad, 0);
    ctx.lineTo(radius + pad, c.height);
    ctx.font = "italic 8px sans-serif";
    ctx.fillText("Im", radius + pad + 2, pad - 2);

    // x axis
    ctx.moveTo(0, radius + pad);
    ctx.lineTo(c.width, radius + pad);
    ctx.fillText("Re", radius + radius + pad + 2, radius + pad - 2);
    ctx.stroke(); // Draw it

    // poles
    ctx.strokeStyle = "green";
    var idx;
    for (idx = 0; idx < poles.length; idx++) {
        let x = radius + Math.round(radius * poles[idx][0]);
        let y = radius - Math.round(radius * poles[idx][1]);
        console.log("pole x coord = " + x)
        console.log("pole y coord = " + y)
        ctx.beginPath();
        ctx.moveTo(x - pSize + pad, y - pSize + pad);
        ctx.lineTo(x + pSize + pad, y + pSize + pad);
        ctx.moveTo(x - pSize + pad, y + pSize + pad);
        ctx.lineTo(x + pSize + pad, y - pSize + pad);
        ctx.stroke();
        if (y !== origin_of_unit_circle[1]) {
            let x_conj = radius + Math.round(radius * poles[idx][0]);
            let y_conj = radius + Math.round(radius * poles[idx][1]);
            ctx.beginPath();
            ctx.moveTo(x_conj - pSize + pad, y_conj - pSize + pad);
            ctx.lineTo(x_conj + pSize + pad, y_conj + pSize + pad);
            ctx.moveTo(x_conj - pSize + pad, y_conj + pSize + pad);
            ctx.lineTo(x_conj + pSize + pad, y_conj - pSize + pad);
            ctx.stroke();
        }
    }

    // zeros
    for (idx = 0; idx < zeros.length; idx++) {
        let x = radius + Math.round(radius * zeros[idx][0]);
        let y = radius - Math.round(radius * zeros[idx][1]);
        console.log("pole x coord = " + x)
        console.log("pole y coord = " + y)
        console.log("radius + padding = " + (radius + pad))
        ctx.beginPath();
        ctx.arc(x + pad, y + pad, zSize, 0, 2 * Math.PI);
        ctx.stroke();
        if (y !== origin_of_unit_circle[1]) {
            let x_conj = radius + Math.round(radius * zeros[idx][0]);
            let y_conj = radius + Math.round(radius * zeros[idx][1]);
            ctx.beginPath();
            ctx.arc(x_conj + pad, y_conj + pad, zSize, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }


    drawResponses();
}




function drawResponses() {
    let magResponse = [];
    let phaseResponse = [];
    for (let i = 0; i < 100; i++) {
        let magPoint = math.complex(1, 0);
        let phasePoint = math.complex(1, 0);
        for (let j = 0; j < zeros.length; j++) {
            let point = math.complex(zeros[j][0], zeros[j][1])
            let conj_point = math.conj(point)
            let temp_conj = math.subtract(Z[i], conj_point);
            let temp_normal = math.subtract(Z[i], point);
            let temp = temp_conj.abs() * temp_normal.abs()
            let phase_temp = temp_normal.arg() + temp_conj.arg()
            magPoint *= temp;
            phasePoint *= phase_temp;
        }
        for (let j = 0; j < poles.length; j++) {
            let point = math.complex(poles[j][0], poles[j][1])
            let conj_point = math.conj(point)
            let temp_conj = math.subtract(Z[i], conj_point);
            let temp_normal = math.subtract(Z[i], point);
            let temp = temp_conj.abs() * temp_normal.abs()
            let phase_temp = temp_normal.arg() + temp_conj.arg()
            magPoint /= temp;
            phasePoint /= phase_temp;
        }

        magResponse.push(magPoint);
        phaseResponse.push(phasePoint);
    }

    // normalize
    var maxMag = Math.max(...magResponse);
    var maxPhase = Math.max(...phaseResponse);
    for (let i = 0; i < magResponse; i++) {
        magResponse[i] /= maxMag;
        phaseResponse[i] /= maxPhase;
    }



    var magnitude_data = {
        x: freqAxis,
        y: magResponse,
        name: 'zeros',
        mode: 'lines'
    };

    var magnitude_layout = {
        title: 'Magnitude response',
        width: 400,
        height: 340,

    };

    Plotly.newPlot('mag_response', [magnitude_data], magnitude_layout);

    var phase_data = {
        x: freqAxis,
        y: phaseResponse,
        name: 'zeros',
        mode: 'lines'
    };

    var phase_layout = {
        title: 'Phase response',
        width: 400,
        height: 340,

    };

    Plotly.newPlot('phase_response', [phase_data], phase_layout);

}



function ZplaneAllPass() {
    var a_zeros_x = []
    var a_poles_x = []
    var a_zeros_y = []
    var a_poles_y = []
    for (a of a_to_display) {
        if (a != '') {
            let zero = math.divide(math.complex(1, 0), math.conj(math.complex(a)));
            let pole = math.complex(a);
            //pole
            let x = pole.re;
            let y = pole.im;
            a_poles_x.push(x)
            a_poles_y.push(y)
            // zero
            let x2 = zero.re;
            let y2 = zero.im;
            a_zeros_x.push(x2)
            a_zeros_y.push(y2)
        }
    }
    var a_zeros = {
        x: a_zeros_x,
        y: a_zeros_y,
        name: 'zeros',
        mode: 'markers'
    };


    var a_poles = {
        x: a_poles_x,
        y: a_poles_y,
        name: 'poles',
        mode: 'markers',
        marker: {
            size: 10,
            color: 'rgb(5, 21, 231)',
            symbol: 'x-thin-open'
        }
    };

    var data = [a_zeros, a_poles];

    var layout = {
        title: 'Line and Scatter Plot',
        width: 350,
        height: 350,
        shapes: [

            // Unfilled Circle

            {
                type: 'circle',
                xref: 'x',
                yref: 'y',
                x0: -1,
                y0: -1,
                x1: 1,
                y1: 1,
                line: {
                    color: 'rgba(50, 171, 96, 1)'
                }
            }
        ],
    };

    Plotly.newPlot("allpass_zplane_polezero2", data, layout);
}

function drawResponseOfAllPass() {
    let phaseResponse = [];
    for (let i = 0; i < 100; i++) {
        let phasePoint = math.complex(1, 0);
        for (let j = 0; j < a_to_display.length; j++) {
            if (a !== '') {
                let zero = math.divide(1, math.conj(math.complex(a_to_display[j])));
                let pole = math.complex(a_to_display[j]);
                let zero_conj = math.conj(zero)
                let pole_conj = math.conj(pole)
                let zero_temp_conj = math.subtract(Z[i], zero_conj);
                let zero_temp_normal = math.subtract(Z[i], zero);
                let zero_phase_temp = zero_temp_normal.arg() + zero_temp_conj.arg()
                let pole_temp_conj = math.subtract(Z[i], pole_conj);
                let pole_temp_normal = math.subtract(Z[i], pole);
                let pole_phase_temp = pole_temp_normal.arg() + pole_temp_conj.arg()
                phasePoint *= zero_phase_temp;
                phasePoint /= pole_phase_temp;
            }
        }
        phaseResponse.push(phasePoint);
    }

    // normalize
    var maxPhase = Math.max(...phaseResponse);
    for (let i = 0; i < phaseResponse; i++) {
        phaseResponse[i] /= maxPhase;
    }
    // plot phase_response

    // graph = Flotr.draw(container, [ phaseData ], { yaxis: { max : 5, min : -5 } });
    var phase_data = {
        x: freqAxis,
        y: phaseResponse,
        name: 'zeros',
        mode: 'lines'
    };

    var layout2 = {
        title: 'All-Pass Phase response',
        width: 400,
        height: 400,

    };

    Plotly.newPlot('allpass_phase_response', [phase_data], layout2);
}




// ################################################### GRAPH ################################
document.getElementById("phase-correction").style.display = "none";
document.getElementById("apply-filter").style.display = "none";
document.getElementById("filter_progress_slider").style.display = "none";



var fileInput = document.getElementById("csv"),

    readFile = function () {
        document.getElementById("phase-correction").style.display = "block";
        document.getElementById("apply-filter").style.display = "block";
        document.getElementById("filter_progress_slider").style.display = "block";

        var reader = new FileReader();
        reader.onload = function () {
            const data = reader.result;
            const elem = data.split(',')

            const allData = elem[2].split(/\r?\n/);
            //console.log(allData)

            console.log("lennn " + elem.length)

            const elemData = []
            for (let i = 1; i < elem.length - 1; i++) { //1000
                elemData[i - 1] = elem[i].split(/\r?\n/);
            }
            //console.log(elemData.length)
            //console.log(elemData[0][1])

            let x = []
            let y = []
            x[0] = elem[0]
            y[0] = elemData[0][0]
            for (let i = 1; i < elemData.length; i++) {
                y[i] = elemData[i][0];
                x[i] = elemData[i - 1][1];
            }
            //console.log(x)
            x_data = []
            y_data = []
            for (let i = 0; i <= elemData.length; i++) {
                x_data[i] = parseFloat(x[i]);
                y_data[i] = parseFloat(y[i]);
            }
        }
        // start reading the file. When it is done, calls the onload event defined above.
        reader.readAsBinaryString(fileInput.files[0]);


        //fn to get the coeffs of the expansion
        function multiply(zeta, z) {
            var result = [];
            zeta.forEach(function (a, i) {
                z.forEach(function (b, j) {
                    result[i + j] = (result[i + j] || 0) + a * b; //to multiply complex numbers
                });
            });
            console.log(result)
            return result
        }



        function Transfer_Fn_coefficients(poles_or_zeros) {

            var coefficients = []
            for (let index = 0; index < poles_or_zeros.length; index++) {
                var pole_or_zero_unit = math.complex(-poles_or_zeros[index][0], -poles_or_zeros[index][1])
                console.log("uuuuPP " + pole_or_zero_unit)
                var p_or_z = math.multiply(pole_or_zero_unit, math.conj(pole_or_zero_unit))
                console.log("pppp " + p_or_z)
                coefficients[index] = [p_or_z, 1];
                console.log("ddddddddd " + coefficients[index])
            }
            poles_or_zeros_coeff = coefficients.reduce(multiply)
            //console.log("poles_coeff " + poles_coeff)
            return poles_or_zeros_coeff
        }


        //difference equation
        function Difference_Equation(zeors_coeff, poles_coeff) {

            let y_filter = [];
            let y_a = []
            let y_b = []
            for (let k = 0; k < x_data.length; k++) {
                y_a[k] = 0
                if (zeros.length > 0) {
                    for (let j = 0; j < zeros.length; j++) {
                        if (k - j >= 0) {
                            y_a[k] += zeors_coeff[zeros.length - j - 1] * x_data[k - j];
                        }
                        //console.log("ZCJ " + "[" + j + "]" + zeors_coeff[j])
                    }
                }
                y_b[k] = 0
                if (poles.length > 0) {
                    for (let i = 1; i <= poles.length; i++) {
                        if (k - i > 0) {
                            y_b[k] += poles_coeff[poles.length - i + 1] * y_data[k - i];
                            console.log("yb" + k + " " + y_b[k])
                        }

                    }
                }
                y_filter[k] = y_a[k] - y_b[k];
            }
            // console.log(y_b)
            // console.log(y_a)
            // console.log(y_filter)
            return y_filter
        }


        var phase_corr_flag = false
        var digital_filter_flag = false

        //filtered signal progress slider
        var slider = document.getElementById("filter_progress_slider");
        var speedOfSignal = slider.value;
        var sliderSpeedOutput = document.getElementById("slider_speed")
        sliderSpeedOutput.innerHTML = slider.value

        //fn to control the speed of the real-time signal
        slider.oninput = function () {
            speedOfSignal = this.value;
            sliderSpeedOutput.innerHTML = this.value

            if (digital_filter_flag == true) {
                apply_digital_filter()
            }
            if (phase_corr_flag == true) {
                apply_phase_correction()
            }
        }



        let cnt = 0;

        function plot(index, y_filter, speedOfSignal) {
            //y_filter = Difference_Equation();
            cnt = index;

            Plotly.newPlot('filtedSignalGraph', [{
                x: [x_data[index]], type: 'line',
                y: [y_filter[index]], type: 'line',
                line: {
                    color: 'rgba(50, 171, 96, 1)'
                }
            }]);


            Plotly.newPlot('mainSignalGraph', [{
                x: [x_data[cnt]], type: 'line',
                y: [y_data[cnt]], type: 'line'
            }]);

            if (cnt <= y_data.length) {


                var graphInterval = setInterval(function () {
                    //console.log(y_data.length)

                    Plotly.extendTraces('filtedSignalGraph', {
                        x: [[x_data[cnt]]],
                        y: [[y_filter[cnt]]]
                    }, [0]);


                    console.log("cntttttt " + cnt)
                    console.log("index: " + index)
                    console.log("spppppp " + speedOfSignal)


                    Plotly.relayout('filtedSignalGraph', {
                        xaxis: {
                            //range: [0, 0.2]
                            range: [x_data[cnt] - 0.02, x_data[cnt] + 0.02]
                        },
                        title: 'Filtered Signal',
                    });
                    console.log(x_data[cnt])

                    var update = {
                        x: [[x_data[cnt]]],
                        y: [[y_data[cnt]]]
                    }

                    Plotly.extendTraces('mainSignalGraph', update, [0]) //, (y_data.length * (speedOfSignal / 100)));

                    // console.log("speeedRe" + (y_data.length * (speedOfSignal / 100)))


                    Plotly.relayout('mainSignalGraph', {
                        xaxis: {
                            range: [x_data[cnt] - 0.02, x_data[cnt] + 0.02]
                        },
                        title: "Main Signal",
                        color: 'rgb(5, 21, 231)',
                    });

                    cnt++;


                }, speedOfSignal * 0.1);


            }

        }

        function apply_phase_correction() {
            let allPassZeros = new Array;
            let allPassPoles = new Array;
            for (a of a_to_display) {
                let zero = math.divide(math.complex(1, 0), math.conj(math.complex(a)));
                let zero_coord = [math.re(zero), math.im(zero)];
                let pole = math.complex(a);
                let pole_coord = [math.re(pole), math.im(pole)];
                allPassZeros.push(zero_coord);
                allPassPoles.push(pole_coord);
            }
            let phase_correction_zeros = zeros.concat(allPassZeros);
            console.log("Total zeros = " + phase_correction_zeros)
            let phase_correction_poles = poles.concat(allPassPoles);
            console.log("Total poles = " + phase_correction_poles)
            var poles_coeff = Transfer_Fn_coefficients(phase_correction_poles)

            var zeors_coeff = Transfer_Fn_coefficients(phase_correction_zeros)
            var y_filter = Difference_Equation(zeors_coeff, poles_coeff)
            if (cnt < x_data.length) { plot(cnt, y_filter) }
            else {
                cnt = 0;
                plot(cnt, y_filter, speedOfSignal)
            }
            console.log("cnt: " + cnt)
            console.log("xxx " + x_data[cnt])
        }

        function apply_digital_filter() {
            var poles_coeff = Transfer_Fn_coefficients(poles);
            var zeors_coeff = Transfer_Fn_coefficients(zeros)
            var y_filter = Difference_Equation(zeors_coeff, poles_coeff)
            if (cnt < x_data.length) { plot(cnt, y_filter) }
            else {
                cnt = 0;
                plot(cnt, y_filter, speedOfSignal)
            }
        }


        document.getElementById("phase-correction").onclick = function () {
            phase_corr_flag = true;
            apply_phase_correction();
        }

        document.getElementById("apply-filter").onclick = function () {
            digital_filter_flag = true;
            apply_digital_filter();
        }

    };

// x_data = readFile().onload

// console.log("xxxxxxxxxxxxxxxx" + x_data)


setZplane(poles, zeros);
ZplaneAllPass();
drawResponseOfAllPass();

let stop_signals = false;
fileInput.addEventListener('change', readFile);


// ###################################################### GRAPH END ##################################################




document.getElementById('add-new-pole').addEventListener("click", addNewPole);
document.getElementById('add-new-zero').addEventListener("click", addNewZero);
document.getElementById('clear-zeros').addEventListener("click", clearZeros);
document.getElementById('clear-poles').addEventListener("click", clearPoles)
document.getElementById('clear-all-points').addEventListener("click", clearAllPoints)


document.getElementById('submit').onclick = function () {
    var checked = document.querySelectorAll('#form2 :checked');
    var added = document.getElementById('selected-elements');
    var selected = [...checked].map(option => option.value);
    var addedE = [...added].map(option => option.value);
    for (var item of selected) {
        if (addedE.indexOf(item) >= 0) {
            return true;
        }
        var select = document.createElement('option');
        select.setAttribute('value', item);
        select.innerHTML = item;
        added.appendChild(select);
        a_to_display.push(item)
        console.log("a_to_display = " + a_to_display)
    }
    ZplaneAllPass()
    drawResponseOfAllPass()
}

document.getElementById('delete').onclick = function () {
    var added = document.getElementById('selected-elements');
    var checked = document.querySelectorAll('#form3 :checked');
    checked.forEach(o => { a_to_display.splice(a_to_display.indexOf(o.value), 1); o.remove(); });
    console.log("a_to_display = " + a_to_display)
    ZplaneAllPass()
    drawResponseOfAllPass()


}

document.getElementById('clear-all').onclick = function () {
    var added = document.getElementById('selected-elements');
    var checked = document.querySelectorAll('#form3 option');
    checked.forEach(o => o.remove());
    a_to_display = []
    console.log("a_to_display = " + a_to_display)
    ZplaneAllPass()
    drawResponseOfAllPass()

}

document.getElementById('add-new-filter').onclick = function () {
    var real = document.getElementById('real');
    var imaginary = document.getElementById('imaginary');
    var menu = document.getElementById('menu-of-all-pass-filters')
    var a = real.value + '+' + imaginary.value + 'i';
    console.log(a)
    var select = document.createElement('option');
    select.setAttribute('value', a);
    select.innerHTML = a;
    menu.appendChild(select);
    a_vals.push(a);

}
