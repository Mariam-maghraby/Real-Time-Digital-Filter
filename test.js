function drawResponses() {
    let phaseResponse = [];
    for (let i = 0; i < 100; i++) {
        let phasePoint = math.complex(1, 0);
        for (let j = 0; j < a_to_display.length; j++) {
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
        phaseResponse.push(phasePoint);
    }
}