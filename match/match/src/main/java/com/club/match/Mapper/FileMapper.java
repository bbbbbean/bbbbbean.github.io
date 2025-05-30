package com.club.match.Mapper;


import com.club.match.Domain.DTO.AttachmentFileDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface FileMapper {
    int uploadFile(AttachmentFileDTO attachmentFileDTO);

    int deleteFile(Long postAttachmentId);

    AttachmentFileDTO selectAt(Long postAttachmentId);

    List<AttachmentFileDTO> selectTempFilesByPostId(@Param("postId") Long postId);

    int updatePostIdAndUrl(AttachmentFileDTO attachmentFileDTO);
}
