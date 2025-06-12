<?php

namespace App\Services\Interfaces;

use App\Models\Branch;

interface BranchServiceInterface
{
    public function getAllBranches($perPage = 15);
    
    public function getActiveBranches();
    
    public function getBranchById($id);
    
    public function createBranch(array $data);
    
    public function updateBranch($id, array $data);
    
    public function deleteBranch($id);
    
    public function changeStatus(Branch $branch);
    
    public function restoreBranch($id);
    
    public function searchBranches($query);
    
    public function getBranchesByManager($managerId);
    
    public function getBranchesWithLocation();
}