export function define<X = never>(x: NoInfer<X>): X {
  return x
}
