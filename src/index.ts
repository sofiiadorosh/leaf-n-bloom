import './styles/main.scss';

const root = document.querySelector<HTMLDivElement>('.root');

if (root) {
  root.innerHTML = `
    <main class="container">
      <h1>Leaf &amp; Bloom</h1>
      <p>Project setup is ready. Let's grow something green.</p>
    </main>
  `;
}
