/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is mozilla.org code.
 *
 * The Initial Developer of the Original Code is
 * Dão Gottwald <dao@design-noir.de>.
 * Portions created by the Initial Developer are Copyright (C) 2007
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Ehsan Akhgari <ehsan.akhgari@gmail.com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */
 
 var gTable, gOrderBy, gTBody, gRows, gUI_showHidden;
document.addEventListener("DOMContentLoaded", function() {
  gTable = document.getElementsByTagName("table")[0];
  gTBody = gTable.tBodies[0];
  if (gTBody.rows.length < 2)
    return;
  gUI_showHidden = document.getElementById("UI_showHidden");
  var headCells = gTable.tHead.rows[0].cells,
      hiddenObjects = false;
  function rowAction(i) {
    return function(event) {
      event.preventDefault();
      orderBy(i);
    }
  }
  for (var i = headCells.length - 1; i >= 0; i--) {
    var anchor = document.createElement("a");
    anchor.href = "";
    anchor.appendChild(headCells[i].firstChild);
    headCells[i].appendChild(anchor);
    headCells[i].addEventListener("click", rowAction(i), true);
  }
  if (gUI_showHidden) {
    gRows = Array.slice(gTBody.rows);
    hiddenObjects = gRows.some(function (row) row.className == "hidden-object");
  }
  gTable.setAttribute("order", "");
  if (hiddenObjects) {
    gUI_showHidden.style.display = "block";
    updateHidden();
  }
}, "false");
function compareRows(rowA, rowB) {
  var a = rowA.cells[gOrderBy].getAttribute("sortable-data") || "";
  var b = rowB.cells[gOrderBy].getAttribute("sortable-data") || "";
  var intA = +a;
  var intB = +b;
  if (a == intA && b == intB) {
    a = intA;
    b = intB;
  } else {
    a = a.toLowerCase();
    b = b.toLowerCase();
  }
  if (a < b)
    return -1;
  if (a > b)
    return 1;
  return 0;
}
function orderBy(column) {
  if (!gRows)
    gRows = Array.slice(gTBody.rows);
  var order;
  if (gOrderBy == column) {
    order = gTable.getAttribute("order") == "asc" ? "desc" : "asc";
  } else {
    order = "asc";
    gOrderBy = column;
    gTable.setAttribute("order-by", column);
    gRows.sort(compareRows);
  }
  gTable.removeChild(gTBody);
  gTable.setAttribute("order", order);
  if (order == "asc")
    for (var i = 0; i < gRows.length; i++)
      gTBody.appendChild(gRows[i]);
  else
    for (var i = gRows.length - 1; i >= 0; i--)
      gTBody.appendChild(gRows[i]);
  gTable.appendChild(gTBody);
}
function updateHidden() {
  gTable.className = gUI_showHidden.getElementsByTagName("input")[0].checked ?
                     "" :
                     "remove-hidden";
}
