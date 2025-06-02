package com.club.match.Mapper;


import com.club.match.Domain.DTO.AttachmentFileDTO;
import com.club.match.Domain.DTO.TempFileDTO;
import lombok.Builder;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface FileMapper {
    int uploadFile(AttachmentFileDTO attachmentFileDTO);
    int uploadTempFile(TempFileDTO tempFileDTO);

    int deleteFile(Long postAttachmentId);

    AttachmentFileDTO selectAt(Long postAttachmentId);

    List<AttachmentFileDTO> selectFilesByPostId(Long postId);
    List<AttachmentFileDTO> selectTempFile();

    int updatePostIdAndUrl(AttachmentFileDTO attachmentFileDTO);

    String chatFileDownload(String fileName);
}