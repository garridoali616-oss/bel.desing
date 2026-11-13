/* PORTAFOLIO EDITABLE — navegación y animaciones */
const validPages = ['datos', 'proyectos', 'hobbies'];
const navLinks = document.querySelectorAll('[data-page-link]');
const menu = document.querySelector('#mobile-menu');
const menuButton = document.querySelector('.mobile-nav-button');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
function activatePage() {
  const slug = window.location.hash.replace('#', '');
  const page = validPages.includes(slug) ? slug : 'datos';
  document.querySelectorAll('.page').forEach(section => {
    const active = section.id === page;
    section.hidden = !active;
    section.classList.toggle('is-active', active);
  });
  navLinks.forEach(link => {
    const active = link.dataset.pageLink === page;
    link.classList.toggle('is-current', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  menu.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  window.scrollTo({ top: 0, behavior: 'instant' });
  document.querySelectorAll(`#${page} .reveal`).forEach(el => revealObserver.observe(el));
}
window.addEventListener('hashchange', activatePage);
activatePage();
menuButton.addEventListener('click', () => {
  menu.hidden = !menu.hidden;
  menuButton.setAttribute('aria-expanded', String(!menu.hidden));
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menu.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
}));

/* EDITA AQUÍ LOS CONTENIDOS Y FOTOGRAFÍAS DE LOS TRES PROYECTOS.
   Las galerías contienen piezas visuales adicionales facilitadas para el portafolio. */
const projects = [
  {
    title: 'Identidad visual', tag: '01 / IDENTIDAD VISUAL',
    image: 'assets/identidad-visual.webp',
    description: 'El símbolo SEIDA destaca por su trazo expresivo y una identidad de fuerte contraste. Aquí exploro cómo la forma, el color y la composición construyen una presencia visual reconocible.',
    tools: 'Símbolo gráfico · Color · Composición',
    gallery: [
      {src: 'assets/identidad-visual.webp', label: 'Identidad SEIDA'},
      {src: 'assets/arte-vinilo.webp', label: 'Diseño de portada y vinilo'},
      {src: 'assets/exploracion-marina.webp', label: 'Experimentación gráfica'}
    ]
  },
  {
    title: 'Diseño editorial', tag: '02 / DISEÑO EDITORIAL',
    image: 'assets/diseno-editorial.webp',
    description: 'Una selección que combina retículas, jerarquías tipográficas y narrativa visual. Incluye una doble página de revista, un cartel, una infografía y un proyecto ilustrado sobre el bizcocho de naranja: formatos distintos para transformar contenidos en experiencias de lectura.',
    tools: 'Retícula · Tipografía · Ilustración · Infografía',
    gallery: [
      {src: 'assets/diseno-editorial.webp', label: 'Doble página editorial'},
      {src: 'assets/cartel-alice.webp', label: 'Cartel tipográfico'},
      {src: 'assets/infografia-diseno.webp', label: 'Infografía sobre carreras de diseño'},
      {src: 'assets/editorial-bizcocho-portada.webp', label: 'Bizcocho de naranja · Portada ilustrada'},
      {src: 'assets/editorial-bizcocho-interior.webp', label: 'Bizcocho de naranja · Página interior'}
    ]
  },
  {
    title: 'Fotografías', tag: '03 / FOTOGRAFÍA',
    image: 'assets/fotografia.webp',
    description: 'La luz, el encuadre y la atmósfera son el hilo conductor de esta selección. La fotografía de producto juega con tonos dorados; el registro de un evento conserva el instante y la imagen urbana experimenta con el movimiento.',
    tools: 'Fotografía de producto · Fotografía documental · Luz y encuadre',
    gallery: [
      {src: 'assets/fotografia.webp', label: 'Fotografía de producto · Perfume'},
      {src: 'assets/foto-evento.webp', label: 'Fotografía documental · Evento'},
      {src: 'assets/hobby-explorar.webp', label: 'Fotografía urbana · Movimiento'}
    ]
  }
];
const dialog = document.querySelector('#project-dialog');
const dialogImage = document.querySelector('#dialog-image');
const dialogMore = document.querySelector('#dialog-more');
const dialogThumbs = document.querySelector('#dialog-thumbs');
const dialogCaption = document.querySelector('#dialog-image-caption');

function selectProjectImage(project, index) {
  const selected = project.gallery[index];
  dialogImage.src = selected.src;
  dialogImage.alt = selected.label;
  dialogCaption.textContent = `${String(index + 1).padStart(2, '0')} / ${String(project.gallery.length).padStart(2, '0')} — ${selected.label}`;
  [...dialogThumbs.children].forEach((button, i) => {
    button.setAttribute('aria-pressed', String(i === index));
    button.classList.toggle('is-selected', i === index);
  });
}
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  const project = projects[Number(button.dataset.project)];
  document.querySelector('#dialog-title').textContent = project.title;
  document.querySelector('#dialog-tag').textContent = project.tag;
  document.querySelector('#dialog-description').textContent = project.description;
  document.querySelector('#dialog-tools').textContent = project.tools;
  dialogThumbs.replaceChildren();
  dialogMore.hidden = !project.gallery || project.gallery.length < 2;
  if (project.gallery && project.gallery.length) {
    project.gallery.forEach((item, i) => {
      const thumb = document.createElement('button');
      thumb.className = 'dialog-thumb';
      thumb.type = 'button';
      thumb.setAttribute('aria-label', `Mostrar imagen ${i + 1}: ${item.label}`);
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = '';
      img.loading = 'lazy';
      thumb.appendChild(img);
      thumb.addEventListener('click', () => selectProjectImage(project, i));
      dialogThumbs.appendChild(thumb);
    });
    selectProjectImage(project, 0);
  } else {
    dialogImage.src = project.image;
    dialogImage.alt = project.title;
  }
  dialog.showModal();
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

const halo = document.querySelector('.cursor-halo');
if (window.matchMedia('(pointer:fine)').matches) {
  document.addEventListener('pointermove', event => {
    halo.style.left = event.clientX + 'px';
    halo.style.top = event.clientY + 'px';
    halo.style.opacity = '1';
    halo.classList.toggle('over-link', !!event.target.closest('a,button'));
  }, {passive:true});
  document.addEventListener('pointerleave', () => halo.style.opacity = '0');
}
const year = new Date().getFullYear();
document.querySelector('#year').textContent = year;
document.querySelectorAll('.year-label').forEach(el => el.textContent = year);
