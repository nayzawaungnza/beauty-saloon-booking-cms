<?php

namespace App\Services;

use Exception;
use App\Models\Branch;
use InvalidArgumentException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Repositories\Backend\BranchRepository;
use App\Services\Interfaces\BranchServiceInterface;

class BranchService implements BranchServiceInterface
{
    protected $branchRepository;

    public function __construct(BranchRepository $branchRepository)
    {
        $this->branchRepository = $branchRepository;
    }

    public function create(array $data)
    {
        DB::beginTransaction();
        try {
            $branch = $this->branchRepository->create($data);
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Branch Creation Error: ' . $exc->getMessage());
            throw new InvalidArgumentException('Unable to create branch');
        }
        DB::commit();
        return $branch;
    }

    public function update(Branch $branch, array $data)
    {
        DB::beginTransaction();
        try {
            $branch = $this->branchRepository->update($branch, $data);
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Branch Update Error: ' . $exc->getMessage());
            throw new InvalidArgumentException('Unable to update branch');
        }
        DB::commit();
        return $branch;
    }

    public function changeStatus(Branch $branch)
    {
        DB::beginTransaction();
        try {
            $branch = $this->branchRepository->changeStatus($branch);
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Branch Status Change Error: ' . $exc->getMessage());
            throw new InvalidArgumentException('Unable to change branch status');
        }
        DB::commit();
        return $branch;
    }

    public function delete(Branch $branch)
    {
        DB::beginTransaction();
        try {
            $result = $this->branchRepository->destroy($branch);
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Branch Deletion Error: ' . $exc->getMessage());
            throw new InvalidArgumentException('Unable to delete branch');
        }
        DB::commit();
        return $result;
    }

    public function getBranches()
    {
        return $this->branchRepository->getBranchEloquent();
    }

    public function getBranchBySlug(string $slug)
    {
        return $this->branchRepository->getBranchBySlug($slug);
    }

    public function getBranchEloquent()
    {
        return $this->branchRepository->getBranchEloquent();
    }

    public function getAllBranches($perPage = 15)
    {
        return $this->branchRepository->getBranches();
    }

    public function getActiveBranches()
    {
        return $this->branchRepository->getActiveBranches();
    }

    public function getBranchById($id)
    {
        return $this->branchRepository->getById($id, ['*']);
    }

    public function createBranch(array $data)
    {
        return $this->create($data);
    }

    public function updateBranch($id, array $data)
    {
        $branch = $this->getBranchById($id);
        return $this->update($branch, $data);
    }

    public function deleteBranch($id)
    {
        $branch = $this->getBranchById($id);
        return $this->delete($branch);
    }

    

    public function restoreBranch($id)
    {
        DB::beginTransaction();
        try {
            $branch = Branch::withTrashed()->findOrFail($id);
            $branch->restore();
            $branch->update(['updated_by' => auth()->user()->id]);
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Branch Restore Error: ' . $exc->getMessage());
            throw new InvalidArgumentException('Unable to restore branch');
        }
        DB::commit();
        return $branch;
    }

    public function searchBranches($query)
    {
        return $this->branchRepository->searchBranches($query);
    }

    public function getBranchesByManager($managerId)
    {
        return $this->branchRepository->getBranchesByManager($managerId);
    }

    public function getBranchesWithLocation()
    {
        return $this->branchRepository->getBranchesWithLocation();
    }
}