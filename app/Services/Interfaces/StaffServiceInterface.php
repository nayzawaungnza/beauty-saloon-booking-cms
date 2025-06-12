<?php

namespace App\Services\Interfaces;

use App\Models\Staff;
interface StaffServiceInterface
{

    public function getAllStaff();
    public function getActiveStaff();
    public function getStaffById($id);
    public function getStaffBySlug($slug);
    public function create(array $data);
    public function update(Staff $staff, array $data);
    public function delete(Staff $staff);
    public function changeStatus(Staff $staff);
    public function restoreStaff($id);
    public function searchStaff($query);
    public function getStaffByBranch($branchId);
    public function getStaffWithServices();
}