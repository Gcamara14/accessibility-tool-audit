# LD RatingStar — Living Design iOS Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/ios/components/ratingstar/index.md`
**Class:** `LDRatingStar`
**Platform:** iOS (UIKit/Swift)

## Overview
Complex icon used for rating stars throughout the app. This class implements a special `LDMediaProtocol` used to display complex icons that use multiple colors.

## Swift API

### Initialization
No initializer parameters are documented in the source.

### Model
No model properties are documented in the source.

### Modifiers
No modifiers are documented in the source.

### Variants / Enums
None documented in source.

### Delegate / Callbacks
Not applicable.

## A11Y Notes
No explicit accessibility properties are documented in the source. `LDRatingStar` is an icon-level component used as part of the larger `LDRating` component. Standard iOS UIKit accessibility (`accessibilityLabel`, `accessibilityHint`, `isAccessibilityElement`) should be managed by the parent `LDRating` component.

## Usage Example
```swift
// LDRatingStar is a complex icon component implementing LDMediaProtocol.
// Refer to LDRating for the higher-level rating view API.
let ratingStar = LDRatingStar()
```
