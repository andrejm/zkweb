#Foundation Sites refresh

## The Grid

Lets use the new xy grid: [docs](https://foundation.zurb.com/sites/docs/xy-grid.html) | [video](https://www.youtube.com/watch?v=Xl5DjEzKn1g) | [github issue with solutions](https://github.com/zurb/foundation-sites/issues/10141)

It has 12 cols as it used to have.

Let's build semantically, with mixins!

### Grid container

It helps limit the grid (e.g. certain width, middle of the page) More markup :( Class `grid-container`, mixin `@include xy-grid-container($width);` 

```
grid-container
	grid
		cell /cell
	/grid
/grid-container
```

### Grid-x and grid-y

`@include xy-grid($direction, $wrap);` where direction is either horizontal or vertical.

Using class `align-center`, `align-justify`, `align-spaced` on grid aligns inside cells. 

Vertical positioning classes: `align-top`, `align-bottom`, `align-middle`

### Grid cell

`@include xy-cell( $size, $gutter-output, $gutters, $gutter-type, $gutter-position, $breakpoint, $vertical )` for a cell

Remember `@include breakpoint( medium );` etc – helper for breakpoints.

### Spacing between cells

Use on grid probably. Class `grid-margin-x` or `grid-padding-x`, mixin `@include xy-gutters($gutters, $gutter-type, $gutter-position, $negative);`
