
.position-aspect-ratio-1.rotatable {
    rotate: 0deg;
    /* animation: movingSun 30s linear infinite; */


  }
  .position-aspect-ratio-1.rotatable::before {
    width: 1.05rem;
    background-color: var(--yellow-sun);
    display: block;
    top: 50%;
    left: 0.8rem;
    translate: 0% -50%;
    z-index: 1;
  }