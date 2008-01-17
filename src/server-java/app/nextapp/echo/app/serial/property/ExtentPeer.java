/* 
 * This file is part of the Echo Web Application Framework (hereinafter "Echo").
 * Copyright (C) 2002-2007 NextApp, Inc.
 *
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
 */

package nextapp.echo.app.serial.property;

import org.w3c.dom.Element;

import nextapp.echo.app.Extent;
import nextapp.echo.app.serial.SerialContext;
import nextapp.echo.app.serial.SerialException;
import nextapp.echo.app.serial.SerialPropertyPeer;
import nextapp.echo.app.util.ConstantMap;
import nextapp.echo.app.util.Context;
import nextapp.echo.app.util.DomUtil;

/**
 * <code>XmlPropertyPeer</code> for <code>Extent</code> properties.
 */
public class ExtentPeer 
implements SerialPropertyPeer {

    private static final ConstantMap suffixConstantMap = new ConstantMap();
    static {
        suffixConstantMap.add(Extent.PX, "px");
        suffixConstantMap.add(Extent.CM, "cm");
        suffixConstantMap.add(Extent.EM, "em");
        suffixConstantMap.add(Extent.EX, "ex");
        suffixConstantMap.add(Extent.IN, "in");
        suffixConstantMap.add(Extent.MM, "mm");
        suffixConstantMap.add(Extent.PC, "pc");
        suffixConstantMap.add(Extent.PT, "pt");
        suffixConstantMap.add(Extent.PERCENT, "%");
    }
    
    public static Extent fromString(String value) 
    throws SerialException {
        int separatorPoint = -1;
        int length = value.length();
        for (int i = length - 1; i >= 0; --i) {
            if (Character.isDigit(value.charAt(i))) {
                separatorPoint = i + 1;
                break;
            }
        }
        if (separatorPoint == -1) {
            throw new IllegalArgumentException(
                    "Cannot create extent from value: " + value);
        }
        int extentValue = Integer.parseInt(value.substring(0, separatorPoint));
        String unitString = value.substring(separatorPoint);
        
        int extentUnits = suffixConstantMap.get(unitString, -1);
        if (extentUnits == -1) {
            return null;
        }
        
        return new Extent(extentValue, extentUnits);
    }

    public static String toString(Extent extent) 
    throws SerialException {
        return extent.getValue() + suffixConstantMap.get(extent.getUnits());
    }

    /**
     * @see nextapp.echo.app.serial.SerialPropertyPeer#toProperty(Context,
     *      Class, org.w3c.dom.Element)
     */
    public Object toProperty(Context context, Class objectClass, Element propertyElement) 
    throws SerialException {
        return fromString(propertyElement.hasAttribute("v") 
                ? propertyElement.getAttribute("v") : DomUtil.getElementText(propertyElement));
    }

    /**
     * @see nextapp.echo.app.serial.SerialPropertyPeer#toXml(nextapp.echo.app.util.Context, 
     *      java.lang.Class, org.w3c.dom.Element, java.lang.Object)
     */
    public void toXml(Context context, Class objectClass, Element propertyElement, Object propertyValue) 
    throws SerialException {
        SerialContext serialContext = (SerialContext) context.get(SerialContext.class);
        propertyElement.setAttribute("t", 
                (serialContext.getFlags() & SerialContext.FLAG_RENDER_SHORT_NAMES) == 0 ? "Extent" : "X");
        propertyElement.appendChild(serialContext.getDocument().createTextNode(toString((Extent) propertyValue)));
    }
}