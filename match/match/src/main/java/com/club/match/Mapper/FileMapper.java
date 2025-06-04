package com.club.match.Mapper;


import com.club.match.Domain.DTO.AttachmentFileDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface FileMapper {
    int uploadFile(AttachmentFileDTO attachmentFileDTO);

    int deleteFile(Long postAttachmentId);

    int deleteTempFile(String userId);

    AttachmentFileDTO selectAt(Long postAttachmentId);

    List<AttachmentFileDTO> selectFilesByPostId(Long postId);

    List<AttachmentFileDTO> selectFileList(String userId);

    List<AttachmentFileDTO> selectTempFile(String userId);

    int updatePostAttachment(Long postId, String attachmentUrl);

    int updatePostIdAndUrl(AttachmentFileDTO attachmentFileDTO);

    String chatFileDownload(String fileName);
}