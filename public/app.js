const API_URL = '/api/entries';

async function loadEntries() {
    const list = document.getElementById('entry-list');
    try {
        const res = await fetch(API_URL);
        const entries = await res.json();

        list.innerHTML = ''; // Clear loading state

        if (entries.length === 0) {
            list.innerHTML = '<div style="text-align:center; color: var(--color-text-muted);">silence...</div>';
            return;
        }

        entries.forEach((entry, index) => {
            const card = document.createElement('div');
            card.className = 'entry-card';
            // Stagger animation
            card.style.animationDelay = `${index * 0.1}s`;

            const content = document.createElement('p');
            content.textContent = entry.content;

            const date = document.createElement('span');
            date.className = 'entry-date';
            // Format date vaguely if possible, or just simple
            const d = new Date(entry.created_at);
            date.textContent = d.toLocaleDateString() + ' • ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            card.appendChild(content);
            card.appendChild(date);
            list.appendChild(card);
        });

    } catch (err) {
        console.error(err);
        list.innerHTML = '<div style="text-align:center; color: var(--color-highlight);">connection lost.</div>';
    }
}

async function submitEntry() {
    const textarea = document.getElementById('entry-content');
    const content = textarea.value.trim();
    const btn = document.getElementById('submit-btn');

    if (!content) return;

    btn.disabled = true;
    btn.textContent = '...';

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content })
        });

        if (res.ok) {
            // Fade out and return to wall
            document.body.style.transition = 'opacity 1s';
            document.body.style.opacity = '0';
            setTimeout(() => {
                window.location.href = 'wall.html';
            }, 1000);
        } else {
            alert('Error'); // Fallback, though we should avoid alerts.
            btn.disabled = false;
            btn.textContent = 'Try Again';
        }
    } catch (err) {
        console.error(err);
        btn.disabled = false;
        btn.textContent = 'Connection Error';
    }
}
