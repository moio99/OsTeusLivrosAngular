
export class Ordeacom {

  ordear(a: any, b: any, inverso: boolean, alfabetico = true) {
    // -1 é orde correcto, o pom ao principio. 1 é invertir a por b, o pom ao final.

    // Os nulos os mando sempre ao final.
    if (a === null) return 1;
    if (b === null) return -1;

    if (alfabetico) {
      if (inverso)
        return b.localeCompare(a);
      else
        return a.localeCompare(b);
    }
    else {
      if (inverso)
        return (a < b) ? 1
        : ((a > b) ? -1 : 0)
      else
        return (a < b) ? -1
        : ((a > b) ? 1 : 0)
    }
  }
}
