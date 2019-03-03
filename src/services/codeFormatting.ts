export function formatCode(code) {
    return code
        .replace(/ \/ /g, ' <span class="operator"> / </span> ')
        .replace(/ > /g, ' <span class="operator"> > </span> ')
        .replace(/ =/g, ' <span class="operator">=</span>')
        .replace(/\*/g, '<span class="operator">*</span>')
        .replace(/\./g, '<span class="operator">.</span>')
        .replace(/\+/g, '<span class="operator">+</span>')
        .replace(/\(/g, '<span class="operator">(</span>')
        .replace(/\)/g, '<span class="operator">)</span>')
        .replace(/ if /g, ' <span class="keyword">if</span> ')
        .replace(/ else/g, ' <span class="keyword">else</span>')
}