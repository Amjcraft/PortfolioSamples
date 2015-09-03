//Essentially this extends/overrides SharePoint's main menu in order to disabled hover styles on navigation items and replace when clicked.
//This solutions only works for on premise versions of SharePoint and a secondary jQuery menu was created to handle an online version

Sys.WebForms.MenuItem = function(parentMenu, listElement, topLevelMenuItem) {
    this.keyMap = parentMenu.keyMap;
    this.parentMenu = parentMenu;
    this.container = parentMenu.container;
    this.element = listElement;
    this.topLevelMenuItem = topLevelMenuItem || this;
    this._anchor = Sys.WebForms.Menu._domHelper.firstChild(listElement);
    while (this._anchor && this._anchor.tagName !== 'A') {
        this._anchor = Sys.WebForms.Menu._domHelper.nextSibling(this._anchor);
    }
    if (this._anchor) {
        this._anchor.tabIndex = -1;
        var subMenu = this._anchor;
        while (subMenu && subMenu.tagName !== 'UL') {
            subMenu = Sys.WebForms.Menu._domHelper.nextSibling(subMenu);
        }
        if (subMenu) {
            this.childMenu = new Sys.WebForms.Menu({ element: subMenu, parentMenuItem: this, depth: parentMenu.depth + 1, container: this.container, keyMap: this.keyMap });
            if (!this.childMenu.isStatic()) {
                Sys.WebForms.Menu._domHelper.appendCssClass(this.element, 'has-custom-popup');
                Sys.WebForms.Menu._domHelper.appendAttributeValue(this.element, 'aria-haspopup', this.childMenu.element.id);
            }
        }
    }
    Sys.WebForms.Menu._elementObjectMapper.map(listElement, this);
    Sys.WebForms.Menu._domHelper.appendAttributeValue(listElement, 'role', 'menuitem');
    Sys.WebForms.Menu._domHelper.appendCssClass(listElement, parentMenu.displayMode);
    if (this._anchor) {
        Sys.WebForms.Menu._domHelper.appendCssClass(this._anchor, parentMenu.displayMode);
    }
    this.element.style.position = "relative";
    if (this.parentMenu.depth == 1 && this.container.orientation == 'horizontal') {
        Sys.WebForms.Menu._domHelper.setFloat(this.element, this.container.rightToLeft ? "right" : "left");
    }
    if (!this.container.disabled) {
        Sys.WebForms.Menu._domHelper.addEvent(this.element, 'mouseover', Sys.WebForms.MenuItem._onmouseover);
        Sys.WebForms.Menu._domHelper.addEvent(this.element, 'mouseout', Sys.WebForms.MenuItem._onmouseout);
    }
};