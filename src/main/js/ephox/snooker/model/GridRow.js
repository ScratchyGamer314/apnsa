define(
  'ephox.snooker.model.GridRow',

  [
    'ephox.katamari.api.Arr',
    'ephox.snooker.api.Structs'
  ],

  function (Arr, Structs) {
    var setCell = function (gridRow, index, cell) {
      var cells = gridRow.cells();
      var r = cells.slice(0, index).concat([ cell ]).concat(cells.slice(index + 1));
      return Structs.rowcells(r, gridRow.section());
    };

    var mutateCell = function (gridRow, index, cell) {
      var cells = gridRow.cells();
      cells[index] = cell;
    };

    var setCells = function (gridRow, cells) {
      return Structs.rowcells(cells, gridRow.section());
    }

    var mapCells = function (gridRow, f) {
      var cells = gridRow.cells();
      var r = Arr.map(cells, f);
      return Structs.rowcells(r, gridRow.section());
    };

    var getCell = function (gridRow, index) {
      return gridRow.cells()[index];
    };

    return {
      setCell: setCell,
      mutateCell: mutateCell
    };
  }
);
