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
var aValues = ['0.5+1i', '1+1i', '0.2+1i', '1.4+0.1i', '2+2i']
var aToDisplay = []
// this var will hold the index of the selected point in zplane
var selectedPoint = -1;
var poleFlag = false;
var zeroFlag = true;

var Z = new Array(100);
var freqAxis = new Array(100);

for (let i = 0; i < 100; i++) {
    Z[i] = math.complex(math.cos(math.PI * (i / 100)), math.sin(math.PI * (i / 100)));
    freqAxis[i] = Math.PI * (i / 100);
}

for (a of aValues) {
    menuOfAllPass = document.getElementById("menu-of-all-pass-filters");
    var select = document.createElement('option');
    select.setAttribute('value', a);
    select.innerHTML = a;
    menuOfAllPass.appendChild(select);

}



function addNewPole() {
    poleFlag = true;
    points = document.getElementById("poles");
    var div = document.createElement("div");
    div.id = 'pole' + (polesNum - 1) + '_polezero2';
    points.appendChild(div);
    // poles.push([0, 0]);
    // polesNum = polesNum + 1;
    // setZplane(poles, zeros);
    // console.log("poles = " + poles);
}

function addNewZero() {
    zeroFlag = true;
    points = document.getElementById("zeros");
    var div = document.createElement('div');
    div.id = 'zero' + (zerosNum - 1) + '_polezero2';
    points.appendChild(div);
    // zeros.push([0, 0]);
    // zerosNum = zerosNum + 1;
    // setZplane(poles, zeros);
    // console.log("zeros = " + zeros);
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
    document.getElementById("zplane_polezero2").style.cursor = "pointer";
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
    //document.getElementById("zplane_polezero2").style.cursor = "pointer";
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
    document.getElementById("zplane_polezero2").style.cursor = "auto";
    e.preventDefault();
    selectedPoint = -1;
}

// also done dragging
function handleMouseOut(e) {
    e.preventDefault();
    selectedPoint = -1;
}

// clicked pole or zero -> delete it
function handleMouseDoubleClick(e) {
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

// function for adding new pole according to where we press
function handleMouseClick(e) {
    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY);
    console.log("entered!!")
    console.log("x coord of point= ", (mouseX - 150) / 100);
    console.log("y coord of point= ", -(mouseY - 150) / 100);
    if (poleFlag) {
        poles.push([(startX - 150) / 100, -(startY - 150) / 100]);
        polesNum = polesNum + 1;
        poleFlag = false;

    }
    else if (zeroFlag) {
        zeros.push([(startX - 150) / 100, -(startY - 150) / 100]);
        zerosNum = zerosNum + 1;
        zeroFlag = false;
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
    handleMouseDoubleClick(e);
});
$("#zplane_polezero2").click(function (e) {
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
    console.log("The poles coord = ", poles);
    console.log("The zeros coords = ", zeros);
}




function drawResponses() {
    let magResponse = [];
    let phaseResponse = [];
    for (let i = 0; i < 100; i++) {
        let magPoint = math.complex(1, 0);
        let phasePoint = math.complex(1, 0);
        for (let j = 0; j < zeros.length; j++) {
            let point = math.complex(zeros[j][0], zeros[j][1])
            let [conjugate, conjugate_mag, conjugate_phase] = CalculateConjugatesDifferences(point, i);
            let temp_normal = math.subtract(Z[i], point);
            let temp = conjugate_mag * temp_normal.abs();
            let phase_temp = temp_normal.arg() + conjugate_phase;
            magPoint *= temp;
            phasePoint *= phase_temp;
        }
        for (let j = 0; j < poles.length; j++) {
            let point = math.complex(poles[j][0], poles[j][1])
            let [conjugate, conjugate_mag, conjugate_phase] = CalculateConjugatesDifferences(point, i);
            let temp = conjugate_mag * math.subtract(Z[i], point).abs()
            let phase_temp = math.subtract(Z[i], point).arg() + conjugate_phase
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
    for (a of aToDisplay) {
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
    drawResponseOfAllPass();
}

function drawResponseOfAllPass() {
    let phaseResponse = [];
    for (let i = 0; i < 100; i++) {
        let phasePoint = math.complex(1, 0);
        for (let j = 0; j < aToDisplay.length; j++) {
            if (a !== '') {
                let zero = math.divide(1, math.conj(math.complex(aToDisplay[j])));
                let pole = math.complex(aToDisplay[j]);
                let [zero_conjugate, zero_conjugate_magnitude, zero_conjugate_phase] = CalculateConjugatesDifferences(zero, i);
                let zero_phase_temp = math.subtract(Z[i], zero).arg() + zero_conjugate_phase
                let [pole_conjugate, pole_conjugate_magnitude, pole_conjugate_phase] = CalculateConjugatesDifferences(pole, i);
                let pole_phase_temp = math.subtract(Z[i], pole).arg() + pole_conjugate_phase
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


function CalculateConjugatesDifferences(point, i) {
    let point_conjugate = math.conj(point)
    let point_temp_conjugate = math.subtract(Z[i], point_conjugate);
    return [point_conjugate, point_temp_conjugate.abs(), point_temp_conjugate.arg()];

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
                var p_or_z = -(math.multiply(pole_or_zero_unit, math.conj(pole_or_zero_unit)))
                console.log("ppppReal " + p_or_z)
                coefficients[index] = [p_or_z, 1];
                console.log("ddddddddd " + coefficients[index])
            }
            poles_or_zeros_coeff = coefficients.reduce(multiply).reverse()

            return poles_or_zeros_coeff
        }

        function real_time_graph(real_time_y_filter) {
            Plotly.newPlot('filtedSignalGraph', [{
                y: [real_time_y_filter[0]], type: 'line',
                line: {
                    color: 'rgba(50, 171, 96, 1)'
                }
            }]);
            Plotly.newPlot('mainSignalGraph', [{
                y: [y_data[0]], type: 'line'
            }]);

        }

        function plot_real_time(cnt, real_time_y_filter, speed) {

            var graphInterval = setInterval(function () {

                Plotly.extendTraces('filtedSignalGraph', {
                    y: [[real_time_y_filter[cnt]]]
                }, [0]);

                Plotly.relayout('filtedSignalGraph', {
                    xaxis: {
                        range: [cnt, cnt - 100]
                    },
                    yaxis: {
                        range: [-20, 20]
                    },
                    title: 'Filtered Signal',
                });

                var update = {
                    y: [[y_data[cnt]]]
                }

                Plotly.extendTraces('mainSignalGraph', update, [0])

                Plotly.relayout('mainSignalGraph', {
                    xaxis: {
                        range: [cnt, cnt - 100]
                    },
                    yaxis: {
                        range: [-20, 20]
                    },
                    title: "Main Signal",
                    color: 'rgb(5, 21, 231)',
                });

            }, speed * 2);


        }


        //difference equation
        function Difference_Equation(zeors_coeff, poles_coeff) {

            let y_filter = [zeors_coeff[0] * y_data[0]];
            let y_filter_term;
            let y_a = [0]
            let y_b = [0]
            for (let k = 1; k < y_data.length - 1; k++) {
                y_a[k] = 0
                if (zeors_coeff.length > 0) {
                    for (let j = 0; j < zeors_coeff.length; j++) {
                        if ((k - j) >= 0) {
                            y_a[k] += (zeors_coeff[j] * y_data[k - j]);
                        }
                    }
                    console.log("y_aFinal " + y_a[k])
                }
                y_b[k] = 0
                if (poles_coeff.length > 0) {
                    for (let i = 1; i < poles_coeff.length; i++) {
                        if (k - i >= 0) {
                            y_b[k] += (poles_coeff[i] * y_filter[k - i]);
                            console.log("y data index = " + (k - i))
                            console.log("y: " + y_filter[k - i])
                            console.log("p_Coeff" + poles_coeff[i])
                            console.log("yb: " + y_b[k])
                        }
                    }
                    console.log("ybFinal " + y_b[k])
                }
                y_filter_term = y_a[k] - y_b[k]
                console.log("y_filter_term: " + y_filter_term)
                plot_real_time(k, y_filter, speedOfSignal)
                y_filter.push(y_filter_term);
                console.log("y-filter " + y_filter[k])
            }
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
            else {
                apply_phase_correction()
            }
        }


        function apply_phase_correction() {
            let allPassZeros = new Array;
            let allPassPoles = new Array;
            for (a of aToDisplay) {
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
            real_time_graph(y_filter);
            Difference_Equation(zeors_coeff, poles_coeff)

            console.log("xxx " + x_data[cnt])
            console.log("y-data: " + y_data)
        }

        function apply_digital_filter() {
            if (poles.length > 0 && zeros.length > 0) {
                var poles_coeff = Transfer_Fn_coefficients(poles);
                var zeors_coeff = Transfer_Fn_coefficients(zeros)
            }
            else {
                if (poles.length == 0) {
                    var poles_coeff = [1, 0]
                    var zeors_coeff = Transfer_Fn_coefficients(zeros)

                }
                if (zeros.length == 0) {
                    var zeors_coeff = [1, 0]
                    var poles_coeff = Transfer_Fn_coefficients(poles)
                    console.log("one pole")
                    console.log("length" + poles_coeff.length)
                }
            }
            let y_filter = [zeors_coeff[0] * y_data[0]];
            real_time_graph(y_filter);
            Difference_Equation(zeors_coeff, poles_coeff)
            console.log("zeros: " + zeors_coeff)
            console.log("poles: " + poles_coeff)
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



setZplane(poles, zeros);
ZplaneAllPass();
drawResponseOfAllPass();

let stop_signals = false;
fileInput.addEventListener('change', readFile);


// ###################################################### GRAPH END ##################################################

setZplane(poles, zeros);
ZplaneAllPass();



fileInput.addEventListener('change', readFile);

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
        aToDisplay.push(item)
        console.log("aToDisplay = " + aToDisplay)
    }
    ZplaneAllPass()
    drawResponseOfAllPass()
}

document.getElementById('delete').onclick = function () {
    var added = document.getElementById('selected-elements');
    var checked = document.querySelectorAll('#form3 :checked');
    checked.forEach(o => { aToDisplay.splice(aToDisplay.indexOf(o.value), 1); o.remove(); });
    console.log("aToDisplay = " + aToDisplay)
    ZplaneAllPass()
    drawResponseOfAllPass()


}

document.getElementById('clear-all').onclick = function () {
    var added = document.getElementById('selected-elements');
    var checked = document.querySelectorAll('#form3 option');
    checked.forEach(o => o.remove());
    aToDisplay = []
    console.log("aToDisplay = " + aToDisplay)
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
    aValues.push(a);

}
