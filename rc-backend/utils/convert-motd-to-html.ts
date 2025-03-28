export function convertMOTDToHTML(motdObj: any) {
    if (!motdObj || !motdObj.extra) {
        return '';
    }
  
    /**
     * Recursively processes MOTD "extra" arrays into HTML spans.
     * @param {Array} extras - The "extra" array from the MOTD object
     * @returns {string} - HTML string with styling
     */
    function processExtras(extras: any) {
        let html = '';
        
        for (const item of extras) {
            // Skip empty text entries (often used as containers for 'extra')
            if (item.text === '' && item.extra) {
                html += processExtras(item.extra);
                continue;
            }
  
            // Build CSS styles from MOTD properties
            const styles = [];
            if (item.bold) styles.push('font-weight: bold;');
            if (item.italic) styles.push('font-style: italic;');
            if (item.underlined) styles.push('text-decoration: underline;');
            if (item.strikethrough) styles.push('text-decoration: line-through;');
            if (item.color) {
                // Handle both named colors (e.g., "gold") and hex values
                const color = item.color.startsWith('#') ? item.color : getColorCode(item.color);
                styles.push(`color: ${color};`);
            }
  
            // Create the HTML span
            const styleAttr = styles.length ? ` style="${styles.join(' ')}"` : '';
            html += `<span${styleAttr}>${item.text || ''}`;
  
            // Process nested extras (if they exist)
            if (item.extra) {
                html += processExtras(item.extra);
            }
  
            html += `</span>`;
        }
  
        return html;
    }
  
    // Helper: Convert Minecraft color names to hex (simplified)
    function getColorCode(colorName: any) {
        const colors: any = {
            'black': '#000000',
            'dark_blue': '#0000AA',
            'dark_green': '#00AA00',
            'dark_aqua': '#00AAAA',
            'dark_red': '#AA0000',
            'dark_purple': '#AA00AA',
            'gold': '#FFAA00',
            'gray': '#AAAAAA',
            'dark_gray': '#555555',
            'blue': '#5555FF',
            'green': '#55FF55',
            'aqua': '#55FFFF',
            'red': '#FF5555',
            'light_purple': '#FF55FF',
            'yellow': '#FFFF55',
            'white': '#FFFFFF'
        };
        return colors[colorName.toLowerCase()] || colorName;
    }
  
    // Process the entire MOTD and wrap in a <p> tag for TinyMCE
    const content = processExtras(motdObj.extra);
    return `<p>${content}</p>`;
  }