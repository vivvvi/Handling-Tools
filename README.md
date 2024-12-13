# GTA5 handling.meta interface
# Handling Flags Overhaul 🚀

## Summary
This branch introduces a **complete overhaul of the Handling Flags system**. It modularizes core logic, enhances the user experience, and introduces **dynamic XML parsing, sub-array support, and raw XML value editing**. The system is now more maintainable, flexible, and ready for future enhancements.

---

## Table of Contents
1. [What's New](#whats-new)
   - [New Files & Structure](#new-files--structure)
   - [Feature Enhancements](#feature-enhancements)
   - [User Interface](#user-interface)
2. [Key Changes](#key-changes)
3. [Bugs / Issues Addressed](#bugs--issues-addressed)
4. [TODO / Future Enhancements](#todo--future-enhancements)
5. [How to Test](#how-to-test)
6. [Notes for Reviewers](#notes-for-reviewers)

---

## [Whats New]

### New Files & Structure
- 🆕 **flags.js** — Core logic for dynamic flag handling, input validation, and state updates.
- 🆕 **handling.js** — Handles XML parsing, raw input updates, and integration with the UI.
- 🆕 **2 JSON Files** — Metadata files for GTAV flags from Plebs and ikt.
- 📁 **File Separation** — Extracted and JS logic from `flags.html` and `handling.html` into standalone modules.

### [Feature Enhancements]
- 🖱️ **Flag System Overhaul** — Unified flag handling logic between `handling.html` and `flags.html`.
- ✍️ **Editable XML UI** — Users can directly edit raw XML values for:
  - `strModelFlags`
  - `strHandlingFlags`
  - `strDamageFlags`
  - `handlingName`
  - `AIHandling`
- 📐 **Dynamic Sub-Array Support** — Support for `vecCentreOfMassOffset` and `vecInertiaMultiplier` for **X, Y, Z** adjustments.
- 📊 **Mass Comparer Overhaul** — Streamlined for flattened views and dynamic column selection.
- 📁 **File Upload Enhancements** — Uploaded file names are now stored and referenced for mass composer and comparison logic.

### [User Interface]
- 🖥️ **Interactive Flags UI** — Users can toggle, calculate, and edit flags with ease.
- 🔥 **Live XML Parsing** — View and edit key XML nodes and sub-array data.
- 🖼️ **Dynamic Tab Support** — Handling and Flags tabs now share the same modular logic.
- ⚡ **Real-time Calculations** — Flag updates are displayed in real-time, with support for **hexadecimal input validation**.

---

## [Key Changes]

| **File**         | **Type**    | **Description**                                                                 |
|-------------------|-------------|---------------------------------------------------------------------------------|
| **flags.js**      | 🆕 New      | Handles flag toggling, input listeners, and dynamic state updates.              |
| **handling.js**   | 🆕 New      | Parses and updates key XML nodes and inline elements.                           |
| **flags.html**    | ✍️ Updated | Modularized to support shared logic with `flags.js`.                           |
| **handling.html** | ✍️ Updated | Supports dynamic tabs, raw XML editing, and sub-array parsing.                  |
| **flags.json**    | 🆕 New      | Metadata from Plebs and ikt for GTAV flag definitions.                         |
| **CSS Updates**   | 🎨 Improved| Added styles for XML editing, flags toggles, and mass comparer.                |

---

## [Bugs / Issues Addressed]
- 🚫 **Input Restrictions** — Hex input validation logic improved. Supports copy-paste while maintaining constraints.
- 🐛 **UI Consistency** — Refactored logic to support tabs in `flags.html` and `handling.html` using shared components.
- 🔥 **Sub-Array Support** — Improved support for nested items like:
```xml
  <SubHandlingData>
    <Item type="CCarHandlingData">
      <fBackEndPopUpCarImpulseMult value="0.100000" />
    </Item>
  </SubHandlingData>
```

# [TODO / Future Enhancements]
- 🐛 not all calculations may still be correct trying to remove miles per hour from calculations. 
- 📋 Complete sub-array support — Handle all sub-handling elements and nested items.
- ⚖️ Remove 'miles' from internal logic — Store data in KM/H and only convert to MPH when required.
- 📊 Mass Comparer Improvements — Full support for flattening and dynamic column selection.
- 🚦 Testing & QA — Full review of XML parsing logic, flag toggling, and mass comparer values.

# [How to Test]
Pull the branch and checkout the new files:
```bash
git checkout feature/handling-flags-overhaul
```
Open handling.html and flags.html.

Test the following:
- Toggling Flags — Ensure flags toggle on and off properly.
- Input Validation — Type hexadecimal values into editable fields and ensure input is constrained to 8 characters.
- File Upload — Test XML file uploads and verify that the file name is referenced correctly.
- Mass Comparer — Test flattened structure, dynamic columns, and file comparisons.
- Sub-Array Support — Verify vecCentreOfMassOffset and vecInertiaMultiplier support.

# [Notes for Reviewers]
This PR introduces significant changes to the structure and logic. Please review the changes to:
- flags.js, handling.js, and the mass comparer logic.
- Input Validation — Ensure user input validation logic works properly.
- Sub-Array Handling — Verify XML sub-array parsing is accurate.
- Flag Calculation — Review flag calculation logic for consistency.
