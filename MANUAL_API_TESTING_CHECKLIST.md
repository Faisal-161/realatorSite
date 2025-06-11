# Manual API Testing Checklist

This checklist is designed to manually verify the core API functionalities and permissions of the Real Estate Collaboration Platform.

**Base URL:** `/api`

**User Roles for Testing:**
*   **Anonymous User:** No authentication token.
*   **Regular User (User A):** Standard registered user.
*   **Another Regular User (User B):** Different standard registered user.
*   **Admin User:** User with `is_staff=True` and `is_superuser=True` (or equivalent admin privileges).

---

## I. Authentication

| Test Case                                     | User Role     | Method | Endpoint             | Expected Status | Expected Behavior                                                                 |
| :-------------------------------------------- | :------------ | :----- | :------------------- | :-------------- | :-------------------------------------------------------------------------------- |
| 1.1 User Registration                         | Anonymous     | POST   | `/users/`            | 201 Created     | New user account created. Response includes user data (excluding password).       |
| 1.2 User Registration (Invalid Data)          | Anonymous     | POST   | `/users/`            | 400 Bad Request | E.g., missing email, username, or password. Error messages in response.         |
| 1.3 User Login (Valid Credentials)            | User A        | POST   | `/token/`            | 200 OK          | Access and refresh tokens returned.                                                 |
| 1.4 User Login (Invalid Credentials)          | User A        | POST   | `/token/`            | 401 Unauthorized| Login fails.                                                                      |
| 1.5 Access User Details (`/me/`) with Token   | User A (Auth) | GET    | `/users/me/`         | 200 OK          | Returns details of User A.                                                        |
| 1.6 Access `/me/` without Token               | Anonymous     | GET    | `/users/me/`         | 401 Unauthorized| Access denied.                                                                    |
| 1.7 Access Admin Resource without Token       | Anonymous     | GET    | `/users/`            | 401 Unauthorized| Access denied.                                                                    |
| 1.8 Access Admin Resource with Non-Admin Token| User A (Auth) | GET    | `/users/`            | 403 Forbidden   | Access denied because User A is not an admin.                                     |

---

## II. User Management

**Note:** For `retrieve`, `update`, `delete`, `{id}` refers to User A's ID unless specified.

| Test Case                                     | User Role     | Method | Endpoint             | Expected Status | Expected Behavior                                                                 |
| :-------------------------------------------- | :------------ | :----- | :------------------- | :-------------- | :-------------------------------------------------------------------------------- |
| 2.1 List Users                                | Admin (Auth)  | GET    | `/users/`            | 200 OK          | Returns a list of all users.                                                      |
| 2.2 List Users (Non-Admin)                    | User A (Auth) | GET    | `/users/`            | 403 Forbidden   | Access denied.                                                                    |
| 2.3 Retrieve Own User Details                 | User A (Auth) | GET    | `/users/{id_user_a}/`| 200 OK          | Returns details of User A.                                                        |
| 2.4 Retrieve Another User's Details           | User B (Auth) | GET    | `/users/{id_user_a}/`| 403 Forbidden   | User B cannot access User A's details directly if not admin.                      |
| 2.5 Retrieve User Details (Admin)             | Admin (Auth)  | GET    | `/users/{id_user_a}/`| 200 OK          | Admin can retrieve User A's details.                                              |
| 2.6 Update Own User Details (e.g., username)  | User A (Auth) | PATCH  | `/users/{id_user_a}/`| 200 OK          | User A's username updated. `role` should not be updatable.                        |
| 2.7 Attempt to Update Own Role                | User A (Auth) | PATCH  | `/users/{id_user_a}/`| 200 OK          | Request includes `role` change. Response shows `role` is unchanged.               |
| 2.8 Update Another User's Details (Admin)     | Admin (Auth)  | PATCH  | `/users/{id_user_a}/`| 200 OK          | Admin updates User A's details (e.g., username). Admin might be able to change role (depends on specific admin setup beyond this scope). |
| 2.9 Update Another User's Details (Non-Admin) | User B (Auth) | PATCH  | `/users/{id_user_a}/`| 403 Forbidden   | User B cannot update User A's details.                                            |
| 2.10 Delete Own User Account                  | User A (Auth) | DELETE | `/users/{id_user_a}/`| 204 No Content  | User A's account deleted.                                                         |
| 2.11 Delete Another User (Admin)              | Admin (Auth)  | DELETE | `/users/{id_user_b}/`| 204 No Content  | Admin deletes User B's account.                                                   |
| 2.12 Delete Another User (Non-Admin)          | User A (Auth) | DELETE | `/users/{id_user_b}/`| 403 Forbidden   | User A cannot delete User B's account.                                            |

---

## III. Property Listings

| Test Case                                       | User Role     | Method | Endpoint                | Expected Status | Expected Behavior                                                                   |
| :---------------------------------------------- | :------------ | :----- | :---------------------- | :-------------- | :---------------------------------------------------------------------------------- |
| 3.1 Create Listing (Authenticated)              | User A (Auth) | POST   | `/listings/`            | 201 Created     | New listing created. `seller` field is User A.                                      |
| 3.2 Create Listing (Anonymous)                  | Anonymous     | POST   | `/listings/`            | 401 Unauthorized| Access denied.                                                                      |
| 3.3 List All Listings                           | Anonymous     | GET    | `/listings/`            | 200 OK          | Returns all listings.                                                               |
| 3.4 List All Listings (Authenticated)           | User A (Auth) | GET    | `/listings/`            | 200 OK          | Returns all listings.                                                               |
| 3.5 Retrieve Specific Listing                   | Anonymous     | GET    | `/listings/{id_listing_A}/`| 200 OK          | Returns listing created by User A.                                                  |
| 3.6 Update Own Listing                          | User A (Auth) | PATCH  | `/listings/{id_listing_A}/`| 200 OK          | Listing details updated.                                                            |
| 3.7 Attempt to Update Another User's Listing    | User B (Auth) | PATCH  | `/listings/{id_listing_A}/`| 403 Forbidden   | User B cannot update User A's listing. (Assuming User A owns listing_A)             |
| 3.8 Update Another User's Listing (Admin)       | Admin (Auth)  | PATCH  | `/listings/{id_listing_A}/`| 200 OK          | Admin can update User A's listing (or 403 if not owner, depends on permissions).   |
| 3.9 Delete Own Listing                          | User A (Auth) | DELETE | `/listings/{id_listing_A}/`| 204 No Content  | Listing deleted.                                                                    |
| 3.10 Attempt to Delete Another User's Listing   | User B (Auth) | DELETE | `/listings/{id_listing_A}/`| 403 Forbidden   | User B cannot delete User A's listing.                                              |
| 3.11 Delete Another User's Listing (Admin)      | Admin (Auth)  | DELETE | `/listings/{id_listing_A}/`| 204 No Content  | Admin can delete User A's listing (or 403 if not owner, depends on permissions).     |

---

## IV. Service Offers

| Test Case                                          | User Role     | Method | Endpoint                 | Expected Status | Expected Behavior                                                                      |
| :------------------------------------------------- | :------------ | :----- | :----------------------- | :-------------- | :------------------------------------------------------------------------------------- |
| 4.1 Create Service Offer (Authenticated)           | User A (Auth) | POST   | `/services/`             | 201 Created     | New service offer created. `service_provider` is User A.                               |
| 4.2 Create Service Offer (Anonymous)               | Anonymous     | POST   | `/services/`             | 401 Unauthorized| Access denied.                                                                         |
| 4.3 List Service Offers (Provider)                 | User A (Auth) | GET    | `/services/`             | 200 OK          | Returns only service offers provided by User A.                                        |
| 4.4 List Service Offers (Another Provider User B)  | User B (Auth) | GET    | `/services/`             | 200 OK          | Returns only service offers provided by User B (should not see User A's unless admin). |
| 4.5 List Service Offers (Admin)                    | Admin (Auth)  | GET    | `/services/`             | 200 OK          | Returns all service offers from all providers.                                         |
| 4.6 List Service Offers (Anonymous)                | Anonymous     | GET    | `/services/`             | 401 Unauthorized| Access denied.                                                                         |
| 4.7 Retrieve Own Specific Service Offer            | User A (Auth) | GET    | `/services/{id_service_A}/`| 200 OK          | Returns service offer by User A.                                                       |
| 4.8 Retrieve Another's Service Offer (Non-Admin)   | User B (Auth) | GET    | `/services/{id_service_A}/`| 404 Not Found   | Or 403. User B cannot see User A's service if not admin (due to queryset filtering). |
| 4.9 Retrieve Another's Service Offer (Admin)       | Admin (Auth)  | GET    | `/services/{id_service_A}/`| 200 OK          | Admin sees User A's service.                                                           |
| 4.10 Update Own Service Offer                      | User A (Auth) | PATCH  | `/services/{id_service_A}/`| 200 OK          | Service offer details updated.                                                         |
| 4.11 Attempt to Update Another's Service Offer     | User B (Auth) | PATCH  | `/services/{id_service_A}/`| 404 Not Found   | Or 403. User B cannot update User A's service.                                       |
| 4.12 Update Another's Service Offer (Admin)        | Admin (Auth)  | PATCH  | `/services/{id_service_A}/`| 200 OK          | Admin can update User A's service (or 403 if not owner, depends on permissions).       |
| 4.13 Delete Own Service Offer                      | User A (Auth) | DELETE | `/services/{id_service_A}/`| 204 No Content  | Service offer deleted.                                                                 |
| 4.14 Attempt to Delete Another's Service Offer   | User B (Auth) | DELETE | `/services/{id_service_A}/`| 404 Not Found   | Or 403. User B cannot delete User A's service.                                       |
| 4.15 Delete Another's Service Offer (Admin)      | Admin (Auth)  | DELETE | `/services/{id_service_A}/`| 204 No Content  | Admin can delete User A's service (or 403 if not owner, depends on permissions).       |

---

## V. Bookings (Basic Checks)

Assuming `buyer` is auto-set and queryset filtering is similar to Services (buyer sees own, staff sees all).

| Test Case                               | User Role     | Method | Endpoint              | Expected Status | Expected Behavior                                                                |
| :-------------------------------------- | :------------ | :----- | :-------------------- | :-------------- | :------------------------------------------------------------------------------- |
| 5.1 Create Booking (Authenticated)      | User A (Auth) | POST   | `/bookings/`          | 201 Created     | New booking created. `buyer` is User A.                                          |
| 5.2 Create Booking (Anonymous)          | Anonymous     | POST   | `/bookings/`          | 401 Unauthorized| Access denied.                                                                   |
| 5.3 List Own Bookings                   | User A (Auth) | GET    | `/bookings/`          | 200 OK          | Returns only bookings made by User A.                                            |
| 5.4 List Bookings (Admin)               | Admin (Auth)  | GET    | `/bookings/`          | 200 OK          | Returns all bookings.                                                            |
| 5.5 List Bookings (Anonymous)           | Anonymous     | GET    | `/bookings/`          | 401 Unauthorized| Access denied.                                                                   |

---

**Note on Permissions for Update/Delete by Admin:**
For listings and services, the checklist notes "Admin can update/delete... (or 403 if not owner, depends on permissions)". Standard ModelViewSet behavior with owner-based permissions often restricts even admins unless explicitly overridden. If admins *should* be able to modify any listing/service, the permission classes on those ViewSets would need to be adjusted (e.g., `IsAdminUserOrOwner`). The current setup mostly assumes owners manage their own resources, and admins manage users. This checklist helps verify the *current* implemented behavior.

This checklist covers the main interactions based on the recent backend changes. Test IDs (e.g., `{id_user_a}`, `{id_listing_A}`) should be replaced with actual IDs during testing.
