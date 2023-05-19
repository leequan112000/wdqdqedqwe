import { prisma } from "../connectDB";
import { byteToKB } from "./filesize";

// Note: all sizes in kilobytes

class UploadLimitTracker {
  private usedSize: number;
  private totalLimit: number;
  public constructor(usedSize: number = 0, totalLimit: number = 0) {
    this.usedSize = usedSize;
    this.totalLimit = totalLimit;
  }

  public async init(biotechId: string) {
    const biotech = await prisma.biotech.findFirst({
      where: {
        id: biotechId
      },
    });
    const aggregations = await prisma.projectAttachment.aggregate({
      where: {
        project_connection: {
          project_request: {
            biotech_id: biotechId,
          },
        },
      },
      _sum: {
        byte_size: true,
      },
    });

    this.usedSize = byteToKB(aggregations._sum.byte_size || 0);
    this.totalLimit = biotech?.upload_limit || 0;
  }

  public validateFilesize(filesize: number) {
    if (filesize + this.usedSize > this.totalLimit) {
      return false;
    }
    return true;
  }

  public deductUsed(filesize: number) {
    const deducted = this.usedSize - filesize
    if (deducted <= 0) {
      this.usedSize = 0;
    } else {
      this.usedSize = deducted;
    }
  }

  public addUsed(filesize: number) {
    this.usedSize += filesize;
  }

  public stats() {
    return {
      total: this.totalLimit,
      used: this.usedSize,
    }
  }
}

export default UploadLimitTracker;
